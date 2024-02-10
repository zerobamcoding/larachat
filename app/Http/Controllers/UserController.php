<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function getMe(Request $request)
    {
        try {

            $user = Auth::user();
            return ['success' => true, "user" => $user];
        } catch (Exception $e) {
            return ['success' => false, "errors" => $e];
        }
    }

    public function changeAvatar(Request $request)
    {
        $postData = $request->only("file");
        $file = $postData['file'];

        $fileArray = array("file" => $file);
        $rules = array("file" => 'required|mimes:jpg,jpeg,png|max:1024');

        $validator = Validator::make($fileArray, $rules);
        if ($validator->fails()) {
            return ["success" => false, "errors" => $validator->errors()->getMessages()];
        } else {
            $name = $file->hashName();
            $uploaded = $request->file("file")->storePubliclyAs("avatars", $name, "public");


            /**
             * @var App\Models\User $user
             */

            $user = Auth::user();

            if (!is_null($user->avatar)) {
                Storage::disk("public")->delete($user->avatar);
            }
            $user->avatar = $uploaded;
            $user->save();

            return ["success" => true, "user" => $user->refresh()];
        }
    }
}
