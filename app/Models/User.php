<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $guarded = [];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'otp',
    ];
    protected $appends = ['type'];

    public function getTypeAttribute()
    {
        return "User";
    }
    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_user')->withPivot(['is_admin', 'added_at']);
    }

    public function channels()
    {
        return $this->belongsToMany(Channel::class, 'channel_user')->withPivot(['is_admin', 'added_at']);
    }

    public function seens()
    {
        return $this->belongsToMany(Message::class, 'user_message');
    }
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expire_otp_at' => 'datetime:Y-m-d',
    ];
}
