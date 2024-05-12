<?php

namespace App\Http\Controllers;

use App\Events\SentDirectProcessed;
use App\Events\SentGroupMessage;
use App\Models\Direct;
use App\Models\Group;
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

        event(new SentGroupMessage($message->load["sender"]));
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
            "model" => "required|in:direct,group"
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
            } else {
                $message = $this->sendGroupMessage($user, $request->all(), $urls);
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

    public function getThreadMessages(Direct | Group $direct, int $offset = 0, int $take = 20)
    {
        return $direct
            ->messages()
            ->with(['replied', "sender"])
            ->latest()
            ->offset($offset)
            ->take($take)
            ->get()
            ->reverse()
            ->values();
    }

    public function getFromUnreaded(Direct | Group $direct, int $user_id)
    {
        $messages = [];
        $unreaded = 0;
        $page = 0;
        do {
            $lists = $this->getThreadMessages($direct, $page * 20);
            foreach ($lists as $list) {
                if ($list->sender != $user_id && !$list->seen) {
                    $unreaded++;
                }
            }
            array_unshift($messages, ...$lists);
            $page++;
        } while ($direct->unreaded_messages > $unreaded);
        return ["messages" => $messages, "page" => $page];
    }

    public function loadmoreMessages(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "id" => "required|integer",
            "model" => "required|in:Direct,Group",
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
            } else {
                $group = Group::find($request->id);
                $messages = $this->getThreadMessages($group, $request->page * 20);
                $has_more = $group->messages()->where("id", "<", $messages[0]->id)->count();
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

        $merged = $directs->merge($groups)->sortBy([fn ($a, $b) => $a['updated_at'] < $b['updated_at']]);

        $threads = [];
        foreach ($merged as $direct) {
            $response = $this->getFromUnreaded($direct, $user->id);
            $direct['messages'] = $response['messages'];
            $direct['page'] = $response['page'];
            $direct["has_more"] = $direct->messages()->count() - count($response['messages']) > 0;
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
            $message = Message::find($request->id);
            $message->seen = true;
            $message->save();
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
