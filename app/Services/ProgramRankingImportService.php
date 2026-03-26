<?php
namespace App\Services;

use App\Models\Ranking;
use App\Models\University;
use App\Models\UniversityName;
use App\Models\EducationalProgram;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ProgramRankingImportService
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
                $university_id = $row['A']; // вуз
                $year = $row['C'];
                $programCode = trim($row['G']);
                $programName = trim($row['H']);
                $rank = $row['I'];
                $score = (float) str_replace(',', '.', $row['K']);

                //$university = University::where('id', $university_id)->first();
                //if (!$university) continue;

                $program = EducationalProgram::where('code', $programCode)->where('name', $programName)->first();
                if (!$program) continue;
                echo $program->code . "\n";

                Ranking::updateOrCreate(
                    [
                        'university_id' => $university_id,
                        'year'  => $year,
                        'level_id' => $program->id,
                    ],
                    [
                        'university_id' => $university_id,
                        'year' => $year,
                        'level_type' => 'program',
                        'level_id' => $program->id,
                        'rank' => $rank,
                        'total_score' => $score,
                    ]
                );

                
            }

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }


    public function show2017(string $filePath)
    {
        DB::beginTransaction();

        try {

            $spreadsheet = IOFactory::load($filePath);


            foreach ($spreadsheet->getSheetNames() as $sheetName) {

                $sheet = $spreadsheet->getSheetByName($sheetName);

                $rows = $sheet->toArray(null, true, true, true);

                $programCode = trim($sheetName);

                $program = EducationalProgram::where('code', $programCode)->first();

                if (!$program) {echo "Program not found for code: $programCode\n"; continue;}
                echo "Processing program: {$program->name} ({$program->code})\n";
                echo "<table><tr><th>University ID</th><th>University Name</th><th>Best Match</th><th>Similarity</th></tr>";
                foreach ($rows as $index => $row) {

                    if ($index < 3) continue; // пропускаем заголовки

                    $universityName = trim((string) ($row['B'] ?? '')); // название вуза в файле
                    $totalScore = (float) str_replace(',', '.', (string) $row['AB']);
                    $rank = $row['A'];

                    if (!$universityName) continue;

                    /*$university = UniversityName::where('name', $universityName)->first();
                    if (!$university) {echo "University not found for name: $universityName\n"; continue;}*/
                    $universities = UniversityName::all();
                    $bestMatch = null;
                    $match = null;
                    $highestPercent = 0;
                    $university_id = null;
                    $id=null;
                    foreach ($universities as $university) {

                        similar_text(
                            $universityName, $university->name, $percent
                        );

                        if ($percent > $highestPercent) {
                            $highestPercent = $percent;
                            $match = $university->name;
                            $id = $university->university_id;
                            if ($highestPercent >= 85) {
                                $bestMatch = $university->name;   
                                $university_id =  $university->university_id;                             
                            }
                        }
                    }
                    if ($highestPercent < 85) {
                        $bestMatch = $match;
                        $university_id = $id;
                    }
                        
                    echo "<tr><td>{$university->university_id}</td><td>{$universityName}</td><td>{$bestMatch}</td><td>{$highestPercent}%</td></tr>";
                    

                    /*Ranking::updateOrCreate(
                        [
                            'year' => 2017,
                            'university_id' => $university_id,                            
                            'level_type' => 'program',
                            'level_id' => $program->id,
                        ],
                        [
                            'year' => 2017,
                            'university_id' => $university_id,                            
                            'level_type' => 'program',
                            'level_id' => $program->id,
                            'rank' => $rank,
                            'total_score' => $totalScore,
                        ]
                    );*/
                }
                echo "</table>";
            }

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function import2017(string $filePath)
    {
        DB::beginTransaction();

        try {

            $spreadsheet = IOFactory::load($filePath);


            foreach ($spreadsheet->getSheetNames() as $sheetName) {

                $sheet = $spreadsheet->getSheetByName($sheetName);

                $rows = $sheet->toArray(null, true, true, true);

                $programCode = trim($sheetName);

                $program = EducationalProgram::where('code', $programCode)->first();

                if (!$program) {echo "Program not found for code: $programCode\n"; continue;}
                echo "Processing program: {$program->name} ({$program->code})\n";
                //echo "<table><tr><th>University ID</th><th>University Name</th><th>Best Match</th><th>Similarity</th></tr>";
                foreach ($rows as $index => $row) {

                    if ($index < 3) continue; // пропускаем заголовки

                    $universityName = trim((string) ($row['B'] ?? '')); // название вуза в файле
                    $totalScore = (float) str_replace(',', '.', (string) $row['AB']);
                    $rank = $row['A'];

                    if (!$universityName) continue;

                    /*$university = UniversityName::where('name', $universityName)->first();
                    if (!$university) {echo "University not found for name: $universityName\n"; continue;}*/
                    $universities = UniversityName::all();
                    $bestMatch = null;
                    $match = null;
                    $highestPercent = 0;
                    $university_id = null;
                    $id=null;
                    foreach ($universities as $university) {

                        similar_text(
                            $universityName, $university->name, $percent
                        );

                        if ($percent > $highestPercent) {
                            $highestPercent = $percent;
                            $match = $university->name;
                            $id = $university->university_id;
                            if ($highestPercent >= 85) {
                                $bestMatch = $university->name;   
                                $university_id =  $university->university_id;                             
                            }
                        }
                    }
                    if ($highestPercent < 85) {
                        $bestMatch = $match;
                        $university_id = $id;
                    }
                        
                    //echo "<tr><td>{$university->university_id}</td><td>{$universityName}</td><td>{$bestMatch}</td><td>{$highestPercent}%</td></tr>";
                    

                    Ranking::updateOrCreate(
                        [
                            'year' => 2017,
                            'university_id' => $university_id,                            
                            'level_type' => 'program',
                            'level_id' => $program->id,
                        ],
                        [
                            'year' => 2017,
                            'university_id' => $university_id,                            
                            'level_type' => 'program',
                            'level_id' => $program->id,
                            'rank' => $rank,
                            'total_score' => $totalScore,
                        ]
                    );
                }
                //echo "</table>";
            }

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}