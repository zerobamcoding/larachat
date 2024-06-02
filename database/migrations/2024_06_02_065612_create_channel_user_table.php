<?php

use App\Models\User;
use App\Models\Channel;
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
        Schema::create('channel_user', function (Blueprint $table) {
            $table->foreignIdFor(Channel::class)->constrained();
            $table->foreignIdFor(User::class)->constrained();
            $table->unique(['channel_id', 'user_id']);
            $table->boolean("is_admin")->default(false);
            $table->foreignId("added_by")->nullable()->constrained("users")->nullOnDelete();
            $table->datetime("added_at")->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('channel_user');
    }
};
