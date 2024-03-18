<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;
    protected $guarded = [];
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
}
