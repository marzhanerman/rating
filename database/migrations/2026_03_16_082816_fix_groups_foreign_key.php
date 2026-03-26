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
        Schema::table('groups', function (Blueprint $table) {
            $table->dropForeign('groups_field_id_foreign'); // ← правильное имя
        });

        Schema::table('groups', function (Blueprint $table) {
            $table->foreign('direction_id')
                ->references('id')
                ->on('directions')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
