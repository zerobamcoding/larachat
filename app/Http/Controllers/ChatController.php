<?php

namespace App\Http\Controllers;

use App\Models\Direct;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;
use Illuminate\Support\Facades\Auth;

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
            "user_to" => "required|exists:users,id",
            "message" => "required|string",
            "replied" => "sometimes|exists:messages,id"
        ]);
        if ($validator->fails()) {
            return ["success" => false, "errors" => $validator->errors()->getMessages()];
        }

        try {
            $user = Auth::user();
            $user_to = User::find($request->user_to);

            $conversation = $this->getConversation($user, $user_to);

            $conversation->messages()->create([
                "message" => $request->message,
                "sender" => $user->id
            ]);

            return ["success" => true, "conversation" => $conversation];
        } catch (Exception $e) {
            return ["success" => false, "erros" => $e];
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
            $newDirect = new Direct();
            $newDirect->user_one = $from->id;
            $newDirect->user_two = $to->id;
            $newDirect->save();
            return $newDirect;
        }
        return $conversation;
    }
}
