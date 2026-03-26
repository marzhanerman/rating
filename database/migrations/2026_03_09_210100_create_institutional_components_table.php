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
        Schema::create('institutional_components', function (Blueprint $table) {
            $table->id();

            $table->foreignId('ranking_id')->constrained()->cascadeOnDelete();

            $table->decimal('university_score', 8, 2)->nullable();
            $table->decimal('expert_score', 8, 2)->nullable();
            $table->decimal('employer_score', 8, 2)->nullable();
            $table->decimal('student_score', 8, 2)->nullable();
            $table->decimal('alumni_score', 8, 2)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('institutional_components');
    }
};
