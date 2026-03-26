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
       Schema::create('indicators', function (Blueprint $table) {
            $table->id();
            $table->enum('level_type', ['institutional', 'program', 'group']);
            $table->string('code'); // 1, 1.1, 3.2.1
            $table->string('name');
            $table->decimal('max_score', 8, 2);

            $table->foreignId('parent_id')
                ->nullable()
                ->constrained('indicators')
                ->cascadeOnDelete();

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('indicators');
    }
};
