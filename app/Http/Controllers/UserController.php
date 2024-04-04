<?php

namespace App\Http\Controllers;

use App\Events\UserIsOnline;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Models\Direct;

class UserController extends Controller
{
    public function userIsOnline(Request $request)
    {
        try {
            /**
             * @var \App\Models\User $user
             */
            $user = Auth::user();
            $user->is_online = true;
            $user->save();
            $directs = Direct::where("user_one", $user->id)->orWhere("user_two", $user->id)->with(["userone", "usertwo"])->get();
            foreach ($directs as $direct) {
                $contact = $direct->userone->id === $user->id ? $direct->usertwo : $direct->userone;
                if ($user->id !== $contact->id) {

                    event(new UserIsOnline($user, $contact, true));
                }
            }
            return ['success' => true];
        } catch (Exception $e) {
            return ['success' => false, "errors" => $e];
        }
    }

    public function userIsOfline(Request $request)
    {
        try {
            /**
             * @var \App\Models\User $user
             */
            $user = Auth::user();
            $user->is_online = false;
            $user->save();
            $directs = Direct::where("user_one", $user->id)->orWhere("user_two", $user->id)->with(["userone", "usertwo"])->get();
            foreach ($directs as $direct) {
                $contact = $direct->userone->id === $user->id ? $direct->usertwo : $direct->userone;
                if ($user->id !== $contact->id) {

                    event(new UserIsOnline($user, $contact, false));
                }
            }
            return ['success' => true];
        } catch (Exception $e) {
            return ['success' => false, "errors" => $e];
        }
    }

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
        try {
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
        } catch (Exception $e) {
            return ['success' => false, "errors" => $e];
        }
    }

    public function update(Request $request)
    {

        $validator = Validator::make($request->all(), [
            "name" => "sometimes|string",
            "bio" => "sometimes|string",
            "mobile" => "sometimes|numeric",
        ]);
        if ($validator->fails()) {
            return ["success" => false, "errors" => $validator->errors()->getMessages()];
        }


        /**
         * @var App\Models\User $user
         */

        $user = Auth::user();
        $user->update($request->all());
        return ["success" => true, "user" => $user];
    }
}
