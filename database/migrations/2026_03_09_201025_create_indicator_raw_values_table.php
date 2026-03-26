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
        Schema::create('indicator_raw_values', function (Blueprint $table) {
            $table->id();

            $table->foreignId('ranking_id')->constrained()->cascadeOnDelete();
            $table->foreignId('indicator_id')->constrained()->cascadeOnDelete();

            $table->decimal('value', 14, 4); // реальное значение

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('indicator_raw_values');
    }
};
