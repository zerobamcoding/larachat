<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Message extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $appends = ['is_seen'];
    protected $hidden = ['seens'];
    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function messageable()
    {
        return $this->morphTo();
    }

    public function replied()
    {
        return $this->belongsTo(Message::class, "replied");
    }

    public function sender()
    {
        return $this->belongsTo(User::class, "sender");
    }

    public function seens()
    {
        return $this->belongsToMany(User::class, "user_message");
    }


    public function getIsSeenAttribute()
    {
        $user = Auth::user();
        return $this->seens->contains($user->id);
    }
}
