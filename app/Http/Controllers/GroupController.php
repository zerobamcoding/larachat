<?php

namespace App\Http\Controllers;

use App\Events\AddedToGroup;
use App\Models\Group;
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
}
