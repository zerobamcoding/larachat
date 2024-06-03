<?php

namespace App\Http\Controllers;

use App\Events\SentChannelMessage;
use App\Events\SentDirectProcessed;
use App\Events\SentGroupMessage;
use App\Models\Direct;
use App\Models\Group;
use App\Models\Channel;
use App\Models\Message;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
    public function joinToThread(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "type" => "required|string",
            "id" => "required|integer",
        ]);
        if ($validator->fails()) {
            return ["success" => false, "errors" => $validator->errors()->getMessages()];
        }

        $user = Auth::user();
        if ($request->type === "Group") {
            Group::find($request->id)->users()->attach($user);
            $thread = Group::find($request->id);
        }

        return ["success" => true, "thread" => $thread];
    }

    public function getThread(Request $request)
    {
        $user = Auth::user();
        $group = Group::where('link', "=", $request->link)->first();
        if ($group) {
            if (!$group->users->contains($user->id)) {
                $group['must_join'] = true;
            }
            return ["success" => true, "thread" => $group];
        } else {
            return ["success" => false];
        }
    }

    public function searchUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "q" => "required|string",

        ]);
        if ($validator->fails()) {
            return ["success" => false, "errors" => $validator->errors()->getMessages()];
        }

        $users = User::where("username", "like", "%" . trim($request->q) . "%")->get()->toArray();
        return ["success" => true, "users" => $users];
    }

    public function sendDirectMessage(User $user, array $data, array $uploaded)
    {
        $to = User::find($data['to']);
        $conversation = $this->getConversation($user, $to);
        $message = $conversation->messages()->create([
            "message" => $data['message'],
            "sender" => $user->id,
            "type" => $data['type'] ?? "text",
            "files" => count($uploaded) ? implode(",", $uploaded) : null,
            "replied" => $data['reply'] ?? null
        ]);
        event(new SentDirectProcessed($message->load(["messageable" => function ($query) {
            return $query->with(['userone', 'usertwo']);
        }, "sender"]), $data['to']));
        return $message;
    }

    public function sendGroupMessage(User $user, array $data, array $uploaded)
    {
        $group = Group::find($data['to']);
        $message = $group->messages()->create([
            "message" => $data['message'],
            "sender" => $user->id,
            "type" => $data['type'] ?? "text",
            "files" => count($uploaded) ? implode(",", $uploaded) : null,
            "replied" => $data['reply'] ?? null
        ]);

        $group->touch();

        event(new SentGroupMessage($message->load(["sender"])));
        return $message;
    }

    public function sendChannelMessage(User $user, array $data, array $uploaded)
    {
        $channel = Channel::find($data['to']);
        $message = $channel->messages()->create([
            "message" => $data['message'],
            "sender" => $user->id,
            "type" => $data['type'] ?? "text",
            "files" => count($uploaded) ? implode(",", $uploaded) : null,
            "replied" => $data['reply'] ?? null
        ]);

        $channel->touch();

        event(new SentChannelMessage($message->load(["sender"])));
        return $message;
    }

    public function sendMessage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "to" => "required|integer",
            "message" => "required|string",
            "replied" => "sometimes|exists:messages,id",
            "files" => "sometimes",
            "reply" => "sometimes",
            "model" => "required|in:direct,group,channel"
        ]);
        if ($validator->fails()) {
            return ["success" => false, "errors" => $validator->errors()->getMessages()];
        }
        try {
            $user = Auth::user();
            $files = $request->file("files");
            $urls = [];
            if ($request->hasFile("files")) {
                foreach ($files as $file) {
                    $name = $file->hashName();
                    $uploaded = $file->storePubliclyAs("messages", $name, "public");
                    $urls[] = $uploaded;
                }
            }

            if ($request->model === 'direct') {
                $message = $this->sendDirectMessage($user, $request->all(), $urls);
            } else if ($request->model === 'group') {
                $message = $this->sendGroupMessage($user, $request->all(), $urls);
            } else {
                $message = $this->sendChannelMessage($user, $request->all(), $urls);
            }


            return ["success" => true, "message" => $message->load(["replied"])];
        } catch (Exception $e) {
            return ["success" => false, "errors" => $e];
        }
    }

    public function getConversation(User $from, User $to): Direct
    {
        $conversation = Direct::where(
            function ($query) use ($from, $to) {
                $query->where(
                    function ($q) use ($from, $to) {
                        $q->where("user_one", $from->id)->where("user_two", $to->id);
                    }
                )->orWhere(
                    function ($q) use ($from, $to) {
                        $q->where("user_two", $from->id)->where("user_one", $to->id);
                    }
                );
            }
        )->first();

        if (!$conversation) {
            $direct = new Direct();
            $direct->user_one = $from->id;
            $direct->user_two = $to->id;
            $direct->save();
            return $direct;
        }
        $conversation->touch();
        return $conversation;
    }

    public function getThreadMessages(Direct | Group | Channel $direct, int $offset = 0, int $take = 20)
    {
        $messages = $direct
            ->messages();

        if (isset($direct->type) && $direct->type === "Group" && isset($direct->pivot->added_at)) {
            $messages = $messages->where('created_at', ">=", $direct->pivot->added_at);
        }
        return
            $messages
            ->with(['replied', "sender"])
            ->latest()
            ->offset($offset)
            ->take($take)
            ->get()
            ->reverse()
            ->values();
    }

    public function getFromUnreaded(Direct | Group | Channel $direct, int $user_id, int $count = 0)
    {
        $messages = [];
        $unreaded = 0;
        $page = 0;
        do {
            $lists = $this->getThreadMessages($direct, $page * 20);
            foreach ($lists as $list) {

                if ($list->sender != $user_id && !$list->is_seen) {
                    $unreaded++;
                }
            }
            array_unshift($messages, ...$lists);
            $page++;
        } while ($count > $unreaded);
        return ["messages" => $messages, "page" => $page];
    }

    public function loadmoreMessages(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "id" => "required|integer",
            "model" => "required|in:Direct,Group,Channel",
            "page" => "required|integer"
        ]);
        if ($validator->fails()) {
            return ["success" => false, "errors" => $validator->errors()->getMessages()];
        }
        try {
            if ($request->model === "Direct") {
                $direct = Direct::find($request->id);
                $messages = $this->getThreadMessages($direct, $request->page * 20);
                $has_more = $direct->messages()->where("id", "<", $messages[0]->id)->count();
            } else if ($request->model === "Group") {
                $group = Group::find($request->id);
                $messages = $this->getThreadMessages($group, $request->page * 20);
                $has_more = $group
                    ->messages()
                    ->where("id", "<", $messages[0]->id)
                    ->where('created_at', ">=", $group->pivot->added_at)
                    ->count();
            } else {
                $direct = Channel::find($request->id);
                $messages = $this->getThreadMessages($direct, $request->page * 20);
                $has_more = $direct->messages()->where("id", "<", $messages[0]->id)->count();
            }

            return ["success" => true, "id" => $request->id, "model" => $request->model, "messages" => $messages, "page" => $request->page, "has_more" => $has_more > 0];
        } catch (Exception $e) {
            return ["success" => false, "errors" => $e];
        }
    }

    public function getThreads()
    {
        /**
         * @var User $user
         */
        $user = Auth::user();
        $directs = Direct::where("user_one", $user->id)->orWhere("user_two", $user->id)->with(["userone", "usertwo"])->orderByDesc('updated_at')
            ->get();

        $groups = $user->groups()->get();
        $channels = $user->channels()->get();
        $groups_channels = $groups->merge($channels);
        $merged = $directs->merge($groups_channels)->sortBy([fn ($a, $b) => $a['updated_at'] < $b['updated_at']]);

        $threads = [];
        foreach ($merged as $direct) {

            $messages = $direct->messages();
            if ($direct->type === "Group") {
                $messages = $messages->where('created_at', ">=", $direct->pivot->added_at);
            }

            $unreaded_messages = $messages->where('sender', '!=', $user->id)
                ->get()
                ->where('is_seen', false)
                ->count();

            $response = $this->getFromUnreaded($direct, $user->id, $unreaded_messages);
            $direct['messages'] = $response['messages'];
            $direct['page'] = $response['page'];
            $direct["has_more"] = $messages->count() - count($response['messages']) > 0;
            $direct["unreaded_messages"] = $unreaded_messages;
            $threads[] = $direct;
        }
        // ->makeHidden(['user_one', "user_two"])
        // ->toArray();

        return ["success" => true, "threads" => $threads];
    }

    public function pinMessage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "id" => "required|exists:messages,id",
            "pin" => "required|boolean",

        ]);
        if ($validator->fails()) {
            return ["success" => false, "errors" => $validator->errors()->getMessages()];
        }
        try {
            $message = Message::find($request->id);
            $message->pinned = $request->pin;
            $message->save();
            return ["success" => true, "message" => $message->refresh()->load(["replied"])];
        } catch (Exception $e) {
            return ["success" => false, "errors" => $e];
        }
    }

    public function seenMessage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "id" => "required|exists:messages,id",
        ]);
        if ($validator->fails()) {
            return ["success" => false, "errors" => $validator->errors()->getMessages()];
        }
        try {
            /**
             * @var User $user
             */
            $user = Auth::user();
            $message = Message::find($request->id);

            $user->seens()->attach($message);
            return ["success" => true, "message" => $message->refresh()->load(["replied"])];
        } catch (Exception $e) {
            return ["success" => false, "errors" => $e];
        }
    }

    public function removeMessage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "id" => "required|exists:messages,id",
        ]);
        if ($validator->fails()) {
            return ["success" => false, "errors" => $validator->errors()->getMessages()];
        }
        try {
            $message = Message::find($request->id);
            $thread = $message->messageable;
            if ($message->type === 'file') {
                $exploded = explode(",", $message->files);
                foreach ($exploded as $file) {
                    unlink(storage_path('app/public/' . $file));
                }
            }
            $message->delete();
            return ["success" => true, "message" => $request->id, "type" => $thread->type, "id" => $thread->id];
        } catch (Exception $e) {
            return ["success" => false, "errors" => $e];
        }
    }
}
