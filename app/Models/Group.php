<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Facades\Auth;

class Group extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $appends = ['type', 'members_count'];
    protected $hidden = ['link'];

    public function getTypeAttribute()
    {
        return "Group";
    }


    public function users()
    {
        return $this->belongsToMany(User::class, 'group_user')->withPivot(['is_admin']);
    }

    public function getMembersCountAttribute()
    {
        return $this->users()->count();
    }

    public function messages(): MorphMany
    {
        return $this->morphMany(Message::class, 'messageable');
    }

    public function latestMessage(): MorphOne
    {
        return $this->morphOne(Message::class, 'messageable')->latestOfMany();
    }
}
