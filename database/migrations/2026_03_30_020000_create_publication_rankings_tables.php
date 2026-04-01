<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('publication_ranking_methodologies', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('year')->unique();
            $table->string('title');
            $table->json('criteria')->nullable();
            $table->longText('html')->nullable();
            $table->timestamps();
        });

        Schema::create('publication_rankings', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('year');
            $table->string('category')->nullable();
            $table->unsignedInteger('place');
            $table->string('university');
            $table->decimal('total', 10, 2)->nullable();
            $table->foreignId('university_id')->nullable()->constrained('universities')->nullOnDelete();
            $table->string('matched_by')->nullable();
            $table->decimal('match_percent', 5, 2)->nullable();
            $table->timestamps();

            $table->index(['year', 'category', 'place']);
            $table->unique(['year', 'category', 'university'], 'publication_rankings_year_category_university_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('publication_rankings');
        Schema::dropIfExists('publication_ranking_methodologies');
    }
};
