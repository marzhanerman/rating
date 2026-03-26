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
        Schema::create('rankings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('university_id')->constrained()->cascadeOnDelete();
            $table->integer('year');

            $table->enum('level_type', ['institutional', 'program', 'group']);
            $table->unsignedBigInteger('level_id');

            $table->integer('rank')->nullable();
            $table->decimal('total_score', 8, 2)->nullable();

            $table->timestamps();

            $table->index(['level_type', 'level_id']);
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rankings');
    }
};
