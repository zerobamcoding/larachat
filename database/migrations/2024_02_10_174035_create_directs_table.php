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
        Schema::create('directs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_one')->constrained("users");
            $table->foreignId('user_two')->constrained("users");
            $table->foreignId('pinned')->nullable()->constrained("messages");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('directs');
    }
};
