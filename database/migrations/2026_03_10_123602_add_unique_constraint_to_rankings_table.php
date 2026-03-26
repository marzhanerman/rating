<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rankings', function (Blueprint $table) {

            $table->unique([
                'university_id',
                'level_type',
                'level_id',
                'year'
            ], 'rankings_unique_program_group');
        });
    }

    public function down(): void
    {
        Schema::table('rankings', function (Blueprint $table) {
            $table->dropUnique('rankings_unique_program_group');
        });
    }
};
