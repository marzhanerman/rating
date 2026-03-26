<?php
namespace App\Services;

use App\Models\Field;
use App\Models\Group;
use App\Models\EducationalProgram;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\DB;

class StructureImportService
{
    public function import(string $filePath)
    {
        DB::beginTransaction();

        try {

            $rows = IOFactory::load($filePath)
                ->getActiveSheet()
                ->toArray(null, true, true, true);

            array_shift($rows); // убрать заголовок

            foreach ($rows as $row) {

                $degree = $this->normalizeDegree($row['D']);

                // 1️⃣ FIELD
                $field = Field::updateOrCreate(
                    [
                        'name' => trim($row['E']),
                        'degree'  => $degree,
                    ],
                    [
                        'name' => trim($row['E']),
                        'degree'  => $degree,
                    ]
                );

                // 2️⃣ GROUP
                /*$group = Group::updateOrCreate(
                    ['code' => $row['D']],
                    [
                        'name_ru' => $row['E'],
                        'field_id' => $field->id,
                        'degree' => $degree,
                    ]
                );*/

                // 3️⃣ PROGRAM
                EducationalProgram::updateOrCreate(
                    [
                        'code' => trim($row['G']),
                        'name' => trim($row['H'])
                    ],
                    [
                        'code' => trim($row['G']),
                        'name' => trim($row['H']),
                        'field_id' => $field->id,
                    ]
                );
            }

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    private function normalizeDegree($value)
    {
        return match(trim($value)) {
            'Бакалавриат' => 'bachelor',
            'Магистратура' => 'master',
            'Докторантура' => 'phd',
            default => null
        };
    }
}