<?php

namespace App\Http\Controllers;

use App\Events\AddedToChannel;
use App\Models\User;
use App\Models\Channel;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ChannelController extends Controller
{
    public function getGroupMembers(Request $request)
    {
        $user = Auth::user();
        $channel = Channel::find($request->id);
        if ($channel->users->contains($user->id)) {
            return ["success" => true, 'members' => $channel->users, 'id' => $request->id];
        } else {
            return ["success" => false];
        }
    }
    public function createNewChannel(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => "required|string",
            "description" => "sometimes|string",
            "users" => "sometimes|array",
            "users.*" => "integer"
        ]);
        if ($validator->fails()) {
            return ["success" => false, "errors" => $validator->errors()->getMessages()];
        }
        try {
            $user = Auth::user();
            $users = [$user->id];
            $avatar = $request->file("avatar");
            if ($request->hasFile("avatar")) {
                $name = $avatar->hashName();
                $uploaded = $avatar->storePubliclyAs("avatars", $name, "public");
            }


            $channel = new Channel();
            $channel->name = $request->name;
            $channel->description = $request->description;
            $channel->avatar = $uploaded ?? null;
            $channel->creator = $user->id;
            $channel->save();

            if (isset($request->users) && count($request->users))
                array_push($users, ...$request->users);

            $channel->users()->attach($users, ["added_by" => $user->id]);
            // }
            foreach ($users as $u) {
                event(new AddedToChannel($u, $channel));
            }
            return ["success" => true, "channel" => $channel];
        } catch (Exception $e) {
            return ["success" => false, "errors" => $e];
        }
    }


    public function changeAdmin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "id" => "required|exists:groups,id",
            "user" => "required|exists:users,id",
            "is_admin" => "required|boolean"
        ]);
        if ($validator->fails()) {
            return ["success" => false, "errors" => $validator->errors()->getMessages()];
        }
        try {
            $user = Auth::user();
            $channel = Channel::find($request->id);
            $admin = User::find($request->user);
            if ($channel->creator === $user->id) {
                $channel->users()->updateExistingPivot($admin, ['is_admin' => $request->is_admin], false);
                return ["success" => true, 'members' => $channel->users, 'id' => $request->id];
            } else {
                return ["success" => false];
            }
        } catch (Exception $e) {
            return ["success" => false, "errors" => $e];
        }
    }

    public function generateLink()
    {
        return substr(base_convert(sha1(uniqid(mt_rand())), 8, 16), 0, 6);
    }

    public function removeGroupUser(Request $request)
    {
        $channel = Channel::find($request->id);
        $remove_user = User::find($request->user);

        $channel->users()->detach($remove_user);
        $channel->save();
        return ["success" => true, 'members' => $channel->users, 'id' => $request->id];
    }

    public function getLink(Request $request)
    {
        $channel = Channel::find($request->id);
        if (is_null($channel->link)) {

            $hash = $this->generateLink();
            $channel->link = $hash;
            $channel->save();
        } else {
            $hash = $channel->link;
        }
        return ["success" => true, 'link' => $hash];
    }
}
