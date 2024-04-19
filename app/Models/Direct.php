<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Facades\Auth;

class Direct extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $appends = ['type', 'unreaded_messages'];

    public function getTypeAttribute()
    {
        return "Direct";
    }

    public function messages(): MorphMany
    {
        return $this->morphMany(Message::class, 'messageable');
    }

    public function latestMessage(): MorphOne
    {
        return $this->morphOne(Message::class, 'messageable')->latestOfMany();
    }

    public function userone()
    {
        return $this->belongsTo(User::class, "user_one", "id");
    }

    public function usertwo()
    {
        return $this->belongsTo(User::class, "user_two", "id");
    }

    public function getUnreadedMessagesAttribute()
    {
        $user = Auth::user();
        return $this->messages()->where("sender", "!=", $user->id)->where("seen", false)->count();
    }
}
