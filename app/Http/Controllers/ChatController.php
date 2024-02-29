<?php

namespace App\Http\Controllers;

use App\Events\SentDirectProcessed;
use App\Models\Direct;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            "replied" => "sometimes|exists:messages,id"
        ]);
        if ($validator->fails()) {
            return ["success" => false, "errors" => $validator->errors()->getMessages()];
        }
        try {
            $user = Auth::user();
            $to = User::find($request->to);

            $conversation = $this->getConversation($user, $to);
            $message = $conversation->messages()->create([
                "message" => $request->message,
                "sender" => $user->id,
            ]);
            event(new SentDirectProcessed($message, $request->to));
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

        return $conversation;
    }
    public function getThreads()
    {
        /**
         * @var User $user
         */
        $user = Auth::user();
        $directs = Direct::where("user_one", $user->id)->orWhere("user_two", $user->id)->with(["messages", "userone", "usertwo"])
            ->get()
            ->makeHidden(['user_one', "user_two"])
            ->toArray();

        return ["success" => true, "threads" => $directs];
    }
}
