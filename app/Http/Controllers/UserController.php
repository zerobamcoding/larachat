<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
}
