<?php

namespace App\Services;

use App\Models\Ranking;
use App\Models\InstitutionalComponent;
use App\Models\University;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\DB;

class InstitutionalRankingImportService
{
    public function import(string $filePath)
    {
        DB::beginTransaction();

        try {
            $spreadsheet = IOFactory::load($filePath);
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray(null, true, true, true);
echo "Total rows: " . count($rows) . "\n";
            // Первая строка — заголовки
            $header = array_shift($rows);

            foreach ($rows as $row) {

                // Пример если столбцы идут по порядку:
                $university_id = $row['B']; // название
                $year = $row['C']; // год
                $rank = $row['D']; // ранг
                $category = $row['E']; // категория
                $totalScore = $row['G']; // общий балл
                $universityScore = $row['H']; // балл университета
                $expertScore = $row['I']; // балл экспертов
                $employerScore = $row['J']; // балл работодателей
                $studentScore = $row['K']; // балл студентов
                $alumniScore = $row['L']; // балл выпускников  

                //$university = University::where('name', $universityName)->first();

                /*if (!$university) {
                    continue; // можно логировать
                }*/

                // Проверка на дубликат
                $existing = Ranking::where('university_id', $university_id)
                    ->where('year', $year)
                    ->where('level_type', 'institutional')
                    ->first();

                if ($existing) {
                    continue;
                }

                $ranking = Ranking::create([
                    'university_id' => $university_id,
                    'year' => $year,
                    'level_type' => 'institutional',
                    'institutional_category' => $category,
                    'rank' => $rank,
                    'total_score' => (float) str_replace(',', '.', $totalScore),
                ]);

                InstitutionalComponent::create([
                    'ranking_id' => $ranking->id,
                    'university_score' => (float) str_replace(',', '.', $universityScore),
                    'expert_score' => (float) str_replace(',', '.', $expertScore),
                    'employer_score' => (float) str_replace(',', '.', $employerScore),
                    'student_score' => (float) str_replace(',', '.', $studentScore),
                    'alumni_score' => (float) str_replace(',', '.', $alumniScore),
                ]);
            }

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}