<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Models\Guest;
use App\Http\Controllers\Controller;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class Authenticate extends Controller
{

    private function clientName(string $agent)
    {
        if (is_numeric(stripos($agent, "mobile"))) {
            return "mobile";
        }
        return "pc";
    }

    private function generateOtp()
    {
        $otp_code = random_int(0, 99999);
        $otp_code = str_pad($otp_code, 5, 0, STR_PAD_LEFT);
        return $otp_code;
    }

    private function generateToken(User $user, string $agent)
    {
        return $user->createToken($this->clientName($agent))->plainTextToken;
    }

    public function otp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mobile' => ['required', 'string'],
        ]);
        if ($validator->fails()) {

            return ["success" => false, "errors" => $validator->errors()];
        }

        $user = User::where('mobile', $request->mobile);

        if (!$user->exists()) {

            $check_guest = Guest::where('mobile', $request->mobile);

            if (!$check_guest->exists()) {
                $otp_code = $this->generateOtp();

                $created_guest = Guest::create([
                    "mobile" => $request->mobile,
                    "otp" => $otp_code,
                    "expire_at" => Carbon::now()->addMinutes(5),
                ]);

                // ********************     Todo   ********************
                // Send Otp to that mobile


                return ["success" => true, "expire" => $created_guest->expire_at->timestamp];
            } else if (!$check_guest->first()->expire_at->isFuture()) {
                $this_guest = $check_guest->first();
                $this_guest->otp = $this->generateOtp();
                $this_guest->expire_at =  Carbon::now()->addMinutes(5);

                $this_guest->save();

                // ********************     Todo   ********************
                // Send Otp to that mobile

                return ["success" => true, "expire" => $this_guest->refresh()->expire_at->timestamp];
            } else {
                return ["success" => true, "expire" => $check_guest->first()->expire_at->timestamp];
            }
        } else {
            $this_user = $user->first();
            if (is_null($this_user->expire_otp_at) || !$this_user->expire_otp_at->isFuture()) {
                $this_user->otp = $this->generateOtp();
                $this_user->expire_otp_at =  Carbon::now()->addMinutes(5);
                $this_user->save();

                // ********************     Todo   ********************
                // Send Otp to that mobile
                return ["success" => true, "expire" => $this_user->refresh()->expire_otp_at->timestamp];
            } else {
                return ["success" => true, "expire" => $this_user->expire_otp_at->timestamp];
            }
        }
    }

    public function checkOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mobile' => ['required', 'string'],
            'code' => ['required', 'string'],
        ]);

        if ($validator->fails()) {

            return ["success" => false, "errors" => $validator->errors()];
        }

        $user = User::where('mobile', $request->mobile);

        if (!$user->exists()) {
            $guest = Guest::where("mobile", $request->mobile)->where("otp", $request->code);
            if (!$guest->exists() || !$guest->first()->expire_at->isFuture()) {
                return ["success" => false, "errors" => ["otp" => ["User not found Or Code has been expired!!"]]];
            }
            return ["success" => true];
        } else {
            $this_user = $user->first();
            if ($this_user->otp == $request->code && $this_user->expire_otp_at->isFuture()) {
                $token = $this->generateToken($this_user, $request->server("HTTP_USER_AGENT"));

                $this_user->otp = null;
                $this_user->expire_otp_at = null;
                $this_user->save();

                return ["success" => true, "token" => $token];
            }
            return ["success" => false, "errors" => ["otp" => ["User not found Or Code has been expired!!"]]];
        }
    }

    public function checkUsername(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'username' => ['required', 'unique:users,username'],
        ]);
        if ($validator->fails()) {
            return ["success" => false, "errors" => $validator->errors()];
        }
        return ["success" => true];
    }


    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => ['required', 'unique:users,username'],
            'mobile' => ['required', 'unique:users,mobile'],
        ]);
        if ($validator->fails()) {
            return ["success" => false, "errors" => ["register" => ["Error occured!!"]]];
        }

        $user = User::create([
            "mobile" => $request->mobile,
            "username" => $request->username
        ]);
        $token = $this->generateToken($user, $request->server("HTTP_USER_AGENT"));
        return ["success" => true, "token" => $token];
    }

    public function logout(Request $request)
    {
        /**
         * @var App\Models\User $user
         */

        $user = Auth::user();
        $userInstance = new UserController();
        $userInstance->userIsOfline($request);
        $user->tokens()->delete();

        return ["success" => true];
    }
}
