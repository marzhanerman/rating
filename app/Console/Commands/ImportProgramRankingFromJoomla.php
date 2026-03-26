<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Symfony\Component\DomCrawler\Crawler;
use App\Models\EducationalProgram;
use App\Models\University;
use App\Models\UniversityName;
use App\Models\Ranking2;

class ImportProgramRankingFromJoomla extends Command
{
    protected $signature = 'import:program-ranking';
    protected $description = 'Import program ranking from old Joomla site';

    public function handle()
    {
        $this->info('Начинаем импорт программного рейтинга...');

        // 1️⃣ Получаем категории годов
        $yearCategories = DB::connection('joomla')
            ->table('f463o_menu') // ⚠️ проверь префикс
            ->where('title', 'like', '%Рейтинг программ%')
            ->where('published', 1)
            ->where('parent_id', 114) // категория "Рейтинги образовательных программ"
            ->get();

        foreach ($yearCategories as $yearCategory) {

            preg_match('/\d{4}/', $yearCategory->title, $matches);
            $year = $matches[0] ?? null;

            if (!$year || $year < 2015 || $year > 2019) continue;

            

            // 2️⃣ Степени
            $degreeCategories = DB::connection('joomla')
                ->table('f463o_menu')
                ->where('parent_id', $yearCategory->id)
                ->get();

            foreach ($degreeCategories as $degreeCategory) {

                $degree = $this->normalizeDegree($degreeCategory->title);
                if (!$degree) continue;
                $this->info("Год: $year");
                $this->info("Степень: $degree");
                // 3️⃣ Направления
                $directionCategories = DB::connection('joomla')
                    ->table('f463o_menu')
                    ->where('parent_id', $degreeCategory->id)
                    ->get();
                    
                foreach ($directionCategories as $directionCategory) {
                    
                    preg_match('/id=(\d+)/', $directionCategory->link, $matches);
                    $articleId = $matches[1] ?? null;

                    if (!$articleId) continue;

                    $material = DB::connection('joomla')
                        ->table('f463o_k2_items')
                        ->where('id', $articleId)
                        ->first();

                    if (!$material) continue;

                    // 4️⃣ Материалы программ
                    $crawler = new Crawler($material->introtext);
                    $links = $crawler->filter('li a');
                   // echo "Processing direction: {$year} / {$degree} / {$directionCategory->title} ({$links->count()})\n";
                    $links->each(function ($linkNode) use ($year, $degree) {
                        $text = trim($linkNode->text());     // текст внутри <a>
                        $href = $linkNode->attr('href');
                        
                        preg_match('/\/item\/(\d+)-(.*?)($|\/)/', $href, $matches);
                        $articleId = $matches[1] ?? null;
                        // echo "Found link: $text (ID: $articleId)\n";
                        if (!$articleId) {
                            preg_match('/(\d+)$/', $href, $matches);
                            $articleId = $matches[1] ?? null;
                        }
                        if (!$articleId) {
                            echo "{$year} / {$degree} / No article ID found in link1: $href\n";
                            return;
                        }
                        else {                        
                            $material = DB::connection('joomla')
                            ->table('f463o_k2_items')
                            ->where('id', $articleId)
                            ->first();
                            if (!$material) {
                                echo "Material not found for ID: $articleId\n";
                                return;
                            }
                            /*if(str_contains($material->introtext, "rowspan=")) {
                                echo "Skipping material with introtext containing 'Рейтинг программ по направлению': ID $articleId\n";
                                return;
                            }*/
                                            
                            $this->parseMaterial($material, $year, $degree, $text, $href);
                        }
                       // $this->parseProgramByLink($href, $year, $degree);
                    });
                    /*$materials = DB::connection('joomla')
                        ->table('f463o_k2_items')
                        ->where('catid', $directionCategory->id)
                        ->where('published', 1)
                        ->get();

                    foreach ($materials as $material) {

                        $this->parseMaterial($material, $year, $degree);
                    }*/
                }
            }
        }

        $this->info('Импорт завершён.');
    }

    private function parseMaterial($material, $year, $degree, $title, $href)
    {
        $title = str_replace(
            ['М', 'В'],
            ['M', 'B'],
            $title
        );
        preg_match('/^(\d+[A-Z]?\d+)/', $title, $matches);
        $programCode = $matches[1] ?? null;

        if (!$programCode) {
            $this->warn("Не найден код программы: {$programCode} в заголовке: $title - {$material->id} - {$href}");
            return;
        }
        
        $program = EducationalProgram::where('code', $programCode)
            ->first();

        if (!$program) {
            $this->warn("Программа не найдена в новой БД: $programCode - $title");
            return;
        }

        $crawler = new Crawler($material->introtext);
         //echo "Processing program: {$program->name} ({$program->code})\n";
        $currentRank = null;
        $crawler->filter('table tr')->each(function ($tr, $index) use ($program, $material, $year, $degree, &$currentRank) {
           // echo "Processing row $index\n";
            
            if ($index === 0) return;
            $universityName= null;
            $cols = $tr->filter('td');
            //     $this->info($cols->eq(1)->text());
            if ($cols->count() === 3) {
                // обычная строка
                $rank = (int) preg_replace('/\D/', '', $cols->eq(0)->text());
                $currentRank = $rank;

                $universityName = trim($cols->eq(1)->text());
                $score = (float) str_replace(',', '.', trim($cols->eq(2)->text()));
            }

            elseif ($cols->count() === 2) {
                // строка из-за rowspan
                $rank = $currentRank;

                $universityName = trim($cols->eq(0)->text());
                $score = (float) str_replace(',', '.', trim($cols->eq(1)->text()));
            }
       
            if (str_contains($universityName, "Наименование"))
                return;
            

            $foundUniversities = $this->findUniversityFuzzy($universityName, $program->code, $material);

            if (empty($foundUniversities)) {
                //$this->warn("Не найден вуз: $universityName для программы: {$program->name} ({$program->code})");
                return;
            }
            foreach ($foundUniversities as $university) {
                /*if($year == 2015 && ($program->code == "6M071900" || $program->code == "6M021200")) {
                    echo "Processing program: {$program->name} ({$program->code})\n";             
                    echo "Processing: {$university->name} - Rank: $rank, Score: $score\n";
                }*/
            Ranking2::updateOrCreate(
                [
                    'university_id' => $university->university_id,
                    'level_type' => 'program',
                    'level_id' => $program->id,
                    'year' => $year,
                ],
                [
                    'rank' => $rank,
                    'total_score' => $score,
                    'degree' => $degree,
                ]
            );
            }
        });
    }

    private function normalizeDegree($title)
    {
        $title = mb_strtolower($title);

        if (str_contains($title, 'бакалавр')) return 'bachelor';
        if (str_contains($title, 'магистр')) return 'master';
        if (str_contains($title, 'докторан')) return 'phd';

        return null;
    }

    private function normalizeName($name)
    {
        $name = mb_strtolower($name);

        // убрать город в скобках
        //$name = preg_replace('/\(.+\)/u', '', $name);

        // убрать кавычки
        $name = str_replace(['«','»','"'], '', $name);

        // убрать двойные пробелы
        $name = preg_replace('/\s+/', ' ', $name);

        return trim($name);
    }

    private function findUniversityFuzzy($name, $programCode = null, $material = null)
    {
        if($name === "Академия «Болашак»" || $name === "Академия «Болашақ»") {
            $name = 'Академия «Болашак» (г. Караганда)';
        }
        $input = mb_strtolower(trim($name));
        $universities = UniversityName::all();

        $bestMatch = null;
        $highestPercent = 0;
        $foundUniversities = [];
        foreach ($universities as $university) {

            similar_text(
                $input,
                mb_strtolower($university->name),
                $percent
            );

            if ($percent > $highestPercent) {
                $highestPercent = $percent;
                $bestMatch = $university;
                
            }
        }
        if($highestPercent < 82) {

            if($bestMatch) {
                $this->warn("{$programCode}:Самый подходящий вуз: {$bestMatch->name} (ID: {$bestMatch->university_id}) with similarity: $highestPercent%\n");
            } else {
                $this->warn("{$programCode}: Не найден подходящий вуз для '{$name} '\n");
            }
             $universities = UniversityName::all();            

            foreach ($universities as $university) {

                if (str_contains(
                    mb_strtolower($input),
                    mb_strtolower($university->name)
                )) {
                    $foundUniversities[] = $university;
                }
            }
            if (count($foundUniversities) > 0) { 
                $this->info("Возможные совпадения для '{$name}':");
                foreach ($foundUniversities as $university) {
                    $this->info("- {$university->name} (ID: {$university->university_id})");
                }
            } else {
                $this->warn("Не найдено совпадений для вуза '{$name}' с использованием поиска по подстроке.");            
            }
        }
        else
            $foundUniversities[] = $bestMatch;
        return $foundUniversities;
    }
}