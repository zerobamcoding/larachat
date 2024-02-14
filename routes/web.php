<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\Authenticate;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Direct;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Base');
})->name("index");


Route::get("/test", function () {
    // $direct = new Direct();
    // $direct->user_one = User::find(1)->id;
    // $direct->user_two = User::find(2)->id;
    // $direct->save();
    /**
     * @var Direct $direct
     */
    $direct = Direct::find(1);

    $message = $direct->messages()->create([
        "message" => "Salam",
        "sender" => User::find(1)->id,

    ]);
    dd($direct->messages);
});

Route::controller(Authenticate::class)->prefix("auth")->name('auth.')->group(function () {
    Route::post('/mobile', 'otp')->name("otp");
    Route::post('/check-otp', 'checkOtp')->name("check.otp");
    Route::post('/check-username', 'checkUsername')->name("check.username");
    Route::post('/register', 'register')->name("register");
    Route::get('/logout', 'logout')->name("logout")->middleware("auth:sanctum");
});

Route::controller(UserController::class)->prefix("user")->name('user.')->group(function () {
    Route::post('/me', 'getMe')->name("me")->middleware("auth:sanctum");
    Route::post('/avatar', 'changeAvatar')->name("avatar")->middleware("auth:sanctum");
    Route::patch('/update', 'update')->name("update")->middleware("auth:sanctum");
});


Route::controller(ChatController::class)->prefix("chat")->name('chat.')->group(function () {
    Route::post('/search', 'searchUser')->name("search")->middleware("auth:sanctum");
});


require __DIR__ . '/auth.php';
