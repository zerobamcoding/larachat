<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->enum("type", ["text", "file"])->default("text");
            $table->string("message");
            $table->foreignId('sender')->constrained("users");
            $table->boolean("seen")->default(false);
            $table->foreignId('replied')->nullable()->constrained("messages");
            $table->morphs("messageable");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
