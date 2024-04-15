<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class GroupController extends Controller
{
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
            $group = new Group();
            $group->name = $request->name;
            $group->admin = $user->id;
            $group->save();

            if (isset($request->users) && count($request->users)) {
                $group->users()->attach($request->users);
            }
            return ["success" => true, "group" => $group];
        } catch (Exception $e) {
            return ["success" => false, "errors" => $e];
        }
    }
}
