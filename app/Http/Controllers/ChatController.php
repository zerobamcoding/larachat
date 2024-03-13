<?php

namespace App\Http\Controllers;

use App\Events\SentDirectProcessed;
use App\Models\Direct;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
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

    public function sendMessage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "to" => "required|exists:users,id",
            "message" => "required|string",
            "replied" => "sometimes|exists:messages,id",
            "files" => "sometimes"
        ]);
        if ($validator->fails()) {
            return ["success" => false, "errors" => $validator->errors()->getMessages()];
        }
        try {
            $user = Auth::user();
            $to = User::find($request->to);

            $conversation = $this->getConversation($user, $to);
            $files = $request->file("files");
            $urls = [];
            if ($request->hasFile("files")) {
                foreach ($files as $file) {
                    $name = $file->hashName();
                    $uploaded = $file->storePubliclyAs("messages", $name, "public");
                    $urls[] = $uploaded;
                }
            }
            $message = $conversation->messages()->create([
                "message" => $request->message,
                "sender" => $user->id,
                "type" => $request->type ?? "text",
                "files" => count($urls) ? implode(",", $urls) : null
            ]);
            event(new SentDirectProcessed($message->load(["messageable" => function ($query) {
                return $query->with(['userone', 'usertwo']);
            }]), $request->to));
            return ["success" => true, "message" => $message];
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

    public function getThreadMessages(Direct $direct, int $offset = 0, int $take = 20)
    {
        return $direct
            ->messages()
            ->latest()
            ->offset($offset)
            ->take($take)
            ->get()
            ->reverse()
            ->values();
    }

    public function getThreads()
    {
        /**
         * @var User $user
         */
        $user = Auth::user();
        $directs = Direct::where("user_one", $user->id)->orWhere("user_two", $user->id)->with(["userone", "usertwo"])->orderByDesc('updated_at')
            ->get();


        $threads = [];
        foreach ($directs as $direct) {
            $message = $this->getThreadMessages($direct);
            $direct['messages'] = $message;
            $threads[] = $direct;
        }
        // ->makeHidden(['user_one', "user_two"])
        // ->toArray();

        return ["success" => true, "threads" => $threads];
    }
}
