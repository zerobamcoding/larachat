<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\Authenticate;
use App\Http\Controllers\ChannelController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Direct;
use App\Models\User;
use App\Models\Group;

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
    // // $direct = new Direct();
    // // $direct->user_one = User::find(1)->id;
    // // $direct->user_two = User::find(2)->id;
    // // $direct->save();
    // /**
    //  * @var Direct $direct
    //  */
    // $direct = Direct::find(1);

    // $message = $direct->messages()->create([
    //     "message" => "Salam",
    //     "sender" => User::find(1)->id,

    // ]);
    // dd($direct->messages);
    $user = User::find(2);
    // $directs = Direct::where("user_one", $user->id)->orWhere("user_two", $user->id)->with(["messages", "userone", "usertwo"])
    //     ->get()
    //     ->makeHidden(['user_one', "user_two"])
    //     ->toArray();
    // dd($directs);
    $group = Group::find(4);
    dd($group->messages()->where('created_at', ">=", '2024-05-04 12:19:36')->get());
    // $user = User::find(1);
    // $group->users()->attach($user);
    // dd(substr(base_convert(sha1(uniqid(mt_rand())), 8, 16), 0, 6));
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
    Route::post('/online', 'userIsOnline')->name("online")->middleware("auth:sanctum");
    Route::post('/ofline', 'userIsOfline')->name("ofline")->middleware("auth:sanctum");
    Route::post('/avatar', 'changeAvatar')->name("avatar")->middleware("auth:sanctum");
    Route::patch('/update', 'update')->name("update")->middleware("auth:sanctum");
});


Route::controller(ChatController::class)->prefix("chat")->name('chat.')->group(function () {
    Route::get('/threads', 'getThreads')->name("threads")->middleware("auth:sanctum");
    Route::post('/search', 'searchUser')->name("search")->middleware("auth:sanctum");
    Route::post('/send', 'sendMessage')->name("send")->middleware("auth:sanctum");
    Route::post('/pin', 'pinMessage')->name("pin")->middleware("auth:sanctum");
    Route::post('/seen', 'seenMessage')->name("seen")->middleware("auth:sanctum");
    Route::post('/loadmore', 'loadmoreMessages')->name("loadmore")->middleware("auth:sanctum");
    Route::post('/remove-message', 'removeMessage')->name("remove.message")->middleware("auth:sanctum");
    Route::post('/get-thread', 'getThread')->name("search.thread")->middleware("auth:sanctum");
    Route::post('/join', 'joinToThread')->name("join")->middleware("auth:sanctum");
});

Route::controller(GroupController::class)->prefix("group")->name('group.')->group(function () {
    Route::get('/members/{id}', 'getGroupMembers')->name("members")->middleware("auth:sanctum");
    Route::post('/new_group', 'createNewGroup')->name("new")->middleware("auth:sanctum");
    Route::post('/admin', 'changeAdmin')->name("change.admin")->middleware("auth:sanctum");
    Route::post('/remove-user', 'removeGroupUser')->name("remove.user")->middleware("auth:sanctum");
    Route::post('/link', 'getLink')->name("link")->middleware("auth:sanctum");
});

Route::controller(ChannelController::class)->prefix("channel")->name('channel.')->group(function () {
    Route::get('/members/{id}', 'getChannelMembers')->name("members")->middleware("auth:sanctum");
    Route::post('/new_channel', 'createNewChannel')->name("new")->middleware("auth:sanctum");
    Route::post('/admin', 'changeAdmin')->name("change.admin")->middleware("auth:sanctum");
    Route::post('/remove-user', 'removeChannelUser')->name("remove.user")->middleware("auth:sanctum");
    Route::post('/link', 'getLink')->name("link")->middleware("auth:sanctum");
});


require __DIR__ . '/auth.php';
