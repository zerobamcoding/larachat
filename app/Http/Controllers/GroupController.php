<?php

namespace App\Http\Controllers;

use App\Events\AddedToGroup;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class GroupController extends Controller
{
    public function getGroupMembers(Request $request)
    {
        $user = Auth::user();
        $group = Group::find($request->id);
        if ($group->users->contains($user->id)) {
            return ["success" => true, 'members' => $group->users, 'id' => $request->id];
        } else {
            return ["success" => false];
        }
    }
    public function createNewGroup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "name" => "required|string",
            "users" => "sometimes|array",
            "users.*" => "integer"
        ]);
        if ($validator->fails()) {
            return ["success" => false, "errors" => $validator->errors()->getMessages()];
        }
        try {
            $user = Auth::user();
            $users = [$user->id];
            $group = new Group();
            $group->name = $request->name;
            $group->creator = $user->id;
            $group->save();

            array_push($users, ...$request->users);
            // if (isset($request->users) && count($request->users)) {

            $group->users()->attach($users, ["added_by" => $user->id]);
            // }
            foreach ($request->users as $u) {
                event(new AddedToGroup($u, $group));
            }
            return ["success" => true, "group" => $group];
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
            $group = Group::find($request->id);
            $admin = User::find($request->user);
            if ($group->creator === $user->id) {
                $group->users()->updateExistingPivot($admin, ['is_admin' => $request->is_admin], false);
                return ["success" => true, 'members' => $group->users, 'id' => $request->id];
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
        $group = Group::find($request->id);
        $remove_user = User::find($request->user);

        $group->users()->detach($remove_user);
        $group->save();
        return ["success" => true, 'members' => $group->users, 'id' => $request->id];
    }

    public function getLink(Request $request)
    {
        $group = Group::find($request->id);
        if (is_null($group->link)) {

            $hash = $this->generateLink();
            $group->link = $hash;
            $group->save();
        } else {
            $hash = $group->link;
        }
        return ["success" => true, 'link' => $hash];
    }
}
