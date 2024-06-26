<?php

use App\Models\Channel;
use App\Models\Group;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});


Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});


Broadcast::channel('group.{id}', function ($user, $id) {
    return Group::find($id)->users->contains($user->id);
});


Broadcast::channel('channel.{id}', function ($user, $id) {
    return Channel::find($id)->users->contains($user->id);
});
