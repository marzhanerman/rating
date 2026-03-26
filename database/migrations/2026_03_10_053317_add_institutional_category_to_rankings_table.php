<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rankings', function (Blueprint $table) {
            $table->enum('institutional_category', [
                'Многопрофильные вузы',
                'Технические вузы',
                'Педагогические вузы',
                'Медицинские вузы',
                'Вузы искусства и спорта',
                'Гуманитарно-экономические вузы',
                'Вузы искусства'
            ])
            ->nullable()
            ->after('level_type');
        });
    }

    public function down(): void
    {
        Schema::table('rankings', function (Blueprint $table) {
            $table->dropColumn('institutional_category');
        });
    }
};
