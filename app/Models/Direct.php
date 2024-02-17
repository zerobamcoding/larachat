<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Direct extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function messages(): MorphMany
    {
        return $this->morphMany(Message::class, 'messageable');
    }
}