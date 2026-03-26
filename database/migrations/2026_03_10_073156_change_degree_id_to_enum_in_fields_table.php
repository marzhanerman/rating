<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('fields', function (Blueprint $table) {

            // удалить внешний ключ
            $table->dropForeign(['degree_id']);

            // удалить колонку
            $table->dropColumn('degree_id');

            // добавить enum
            $table->enum('degree', [
                'bachelor',
                'master',
                'phd'
            ])->after('name');
        });
    }

    public function down(): void
    {
        Schema::table('fields', function (Blueprint $table) {

            $table->dropColumn('degree');

            $table->foreignId('degree_id')
                ->constrained()
                ->cascadeOnDelete();
        });
    }
};
