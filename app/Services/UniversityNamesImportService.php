<?php
namespace App\Services;

use App\Models\Ranking;
use App\Models\University;
use App\Models\EducationalProgram;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;

class UniversityNamesImportService
{
    public function import(string $filePath)
    {
        DB::beginTransaction();

        try {
            $spreadsheet = IOFactory::load($filePath);
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray(null, true, true, true);

            array_shift($rows); // убрать заголовок

            foreach ($rows as $row) {
                $university_id = $row['B']; // вуз
                $year = $row['C'];
                $name = trim($row['F']);

                if (!$university_id || !$year || !$name) {
                        continue;
                    }

                    $existing = \App\Models\UniversityName::where('university_id', $university_id)
                        ->where('name', $name)
                        ->first();

                    if ($existing) {
                        $existing->valid_from = min($existing->valid_from, $year);
                        $existing->valid_to   = max($existing->valid_to, $year);
                        $existing->save();
                    } else {
                        \App\Models\UniversityName::create([
                            'university_id' => $university_id,
                            'name'          => $name,
                            'valid_from'    => $year,
                            'valid_to'      => $year,
                        ]);
                    }

                
            }

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

}