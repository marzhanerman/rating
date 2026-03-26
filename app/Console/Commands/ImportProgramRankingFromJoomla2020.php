<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Symfony\Component\DomCrawler\Crawler;
use App\Models\EducationalProgram;
use App\Models\University;
use App\Models\UniversityName;
use App\Models\Ranking2;
use App\Models\Direction;
use App\Models\Group;
use App\Models\Field;

class ImportProgramRankingFromJoomla2020 extends Command
{
    protected $signature = 'import:program-ranking-2020';
    protected $description = 'Import program ranking 2020 from old Joomla site';

    public function handle()
    {
        $this->info('Начинаем импорт программного рейтинга 2020...');

        // 1️⃣ Получаем категории годов
        $yearCategories = DB::connection('joomla')->table('f463o_menu') // ⚠️ проверь префикс
        
            ->where('title', 'like', '%Рейтинг программ%')
            ->where('published', 1)
            ->where('parent_id', 114) // категория "Рейтинги образовательных программ"
            ->orderBy('lft', 'asc') 
            ->get();

        foreach ($yearCategories as $yearCategory)
        {

            preg_match('/\d{4}/', $yearCategory->title, $matches);
            $year = $matches[0] ?? null;

            if (!$year || $year != 2020) continue;

            // 2️⃣ Степени
            $degreeCategories = DB::connection('joomla')->table('f463o_menu')
                ->where('parent_id', $yearCategory->id)
                ->orderBy('lft', 'asc')
                ->get();

            foreach ($degreeCategories as $degreeCategory)
            {

                $degree = $this->normalizeDegree($degreeCategory->title);
                if (!$degree) continue;
                $this->info("Год: $year");
                $this->info("Степень: $degree");
                // 3️⃣ Направления
                $fields = DB::connection('joomla')->table('f463o_menu')
                    ->where('parent_id', $degreeCategory->id)
                    ->orderBy('lft', 'asc')
                    ->get();

                foreach ($fields as $fieldCategory)
                {
                    $text = trim($fieldCategory->title);
                    $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');

                    if (mb_stripos($text, 'направление') !== false)
                    {
                        $text = html_entity_decode(trim($text) , ENT_QUOTES | ENT_HTML5, 'UTF-8');
                        $text = str_replace("\xc2\xa0", ' ', $text);

                        $fieldName = preg_replace('/^Направление\s*/u', '', $text);
                        $fieldName = trim($fieldName, ' «»"');
                        
                        if (!$fieldName) continue;
                        // Сохраняем в БД
                        $field = Field::firstOrCreate(['name' => $fieldName, 'degree' => $degree, 'type' => 'new', ]);
                        //dump("Field: " . $fieldName);
                        preg_match('/id=(\d+)/', $fieldCategory->link, $matches);
                        $articleId = $matches[1] ?? null;
                        
                        if (!$articleId) continue;

                        $material = DB::connection('joomla')->table('f463o_k2_items')
                            ->where('id', $articleId)->first();

                        if (!$material) continue;
                        // 4️⃣ Материалы направлений
                        $crawler = new Crawler($material->introtext);
                        //$links = $crawler->filter('li a');

                        
                       
                        $headings = $crawler->filter('a.heading2, a.heading');
                        for ($i = 0;$i < $headings->count();$i++)
                        {

                            $heading = $headings->eq($i);

                            $text = trim($heading->text());
                            $directionName = null;
                            // 1️⃣ Вырезаем название направления
                            if (str_contains($text, '«') && str_contains($text, '»')) {
                                $directionName = Str::between($text, '«', '»');
                            }

                            echo "Found direction: $directionName\n";
                            if (!$directionName) continue;

                            $directionName = trim($directionName);

                            // 2️⃣ Сохраняем направление в БД
                            $direction = Direction::firstOrCreate(['name' => $directionName, 'field_id' => $field->id, 'year' => $year,]);
                            
                            //dump("Direction: " . $directionName);
                            
                            // следующий sibling
                            $next = $heading->getNode(0)->nextSibling;

                            while ($next) {

                                // если встретили следующий heading — остановиться
                                if ($next->nodeName === 'a' && 
                                    str_contains($next->getAttribute('class'), 'heading')) {
                                    break;
                                }

                                if ($next->nodeName === 'ul') {

                                    $ulCrawler = new Crawler($next);

                                    // 4️⃣ Парсим группы
                                    $ulCrawler->filter('li a')->each(function ($groupLink) use ($year, 
                                    $field, $direction,
                                    $degree)
                                    {

                                        $text = trim($groupLink->text());

                                        // Вытащить код группы (6B011)
                                        preg_match('/^(\S+)\s*-\s*(.+)$/u', $text, $matches);

                                        $groupCode = $matches[1] ?? null;
                                        $groupName = $matches[2] ?? null;

                                        if (!$groupCode) return;

                                        // Нормализуем русские буквы
                                        $groupCode = str_replace(['М', 'В'], ['M', 'B'], $groupCode);

                                        // Сохраняем группу
                                        $group = Group::firstOrCreate(['code' => $groupCode, 'name' => $groupName, 'direction_id' => $direction->id, 'year' => $year], ['code' => $groupCode, 'name' => $groupName, 'direction_id' => $direction->id, 'year' => $year]);

                                        dump("Group: $groupName");

                                        $href = $groupLink->attr('href');

                                        preg_match('/\/item\/(\d+)-(.*?)($|\/)/', $href, $matches);
                                        $articleId = $matches[1] ?? null;
                                        // echo "Found link: $text (ID: $articleId)\n";
                                        if (!$articleId)
                                        {
                                            preg_match('/(\d+)$/', $href, $matches);
                                            $articleId = $matches[1] ?? null;
                                        }
                                        if (!$articleId)
                                        {
                                            echo "{$year} / {$degree} / No article ID found in link1: $href\n";
                                            return;
                                        }
                                        else
                                        {
                                            $material = DB::connection('joomla')->table('f463o_k2_items')
                                                ->where('id', $articleId)->first();
                                            if (!$material)
                                            {
                                                echo "Material not found for ID: $articleId\n";
                                                return;
                                            }
                                            /*if(str_contains($material->introtext, "rowspan=")) {
                                            echo "Skipping material with introtext containing 'Рейтинг программ по направлению': ID $articleId\n";
                                            return;
                                            }*/

                                            $this->parseMaterial($material, $year, $degree, $group->id);
                                        }

                                    });
                                }

                                $next = $next->nextSibling;
                            }
                            
                        }

                    }
                }
            }
        }
        $this->info('Импорт завершён.');
    }

    private function parseMaterial($material, $year, $degree, $groupId)
    {
        

        $crawler = new Crawler($material->introtext);
        echo "Processing group: {$groupId} \n";
        $currentRank = null;
        $crawler->filter('table tr')->each(function ($tr, $index) use ($groupId, $year, $degree, &$currentRank)
        {
            // echo "Processing row $index\n";
            if ($index === 0) return;
            $universityName = null;
            $cols = $tr->filter('td');
            //     $this->info($cols->eq(1)->text());
            if ($cols->count() === 3)
            {
                // обычная строка
                $rank = (int)preg_replace('/\D/', '', $cols->eq(0)
                    ->text());
                $currentRank = $rank;

                $universityName = trim($cols->eq(1)
                    ->text());
                $score = (float)str_replace(',', '.', trim($cols->eq(2)
                    ->text()));
            }

            elseif ($cols->count() === 2)
            {
                // строка из-за rowspan
                $rank = $currentRank;

                $universityName = trim($cols->eq(0)
                    ->text());
                $score = (float)str_replace(',', '.', trim($cols->eq(1)
                    ->text()));
            }

            if (str_contains($universityName, "Наименование")) return;

            $foundUniversities = $this->findUniversityFuzzy($universityName, $groupId);

            if (empty($foundUniversities))
            {
                $this->warn("Не найден вуз: $universityName для группы: {$groupId}");
                return;
            }
            foreach ($foundUniversities as $university)
            {
                /*if($year == 2015 && ($program->code == "6M071900" || $program->code == "6M021200")) {
                echo "Processing program: {$program->name} ({$program->code})\n";             
                echo "Processing: {$university->name} - Rank: $rank, Score: $score\n";
                }*/
                Ranking2::updateOrCreate(
                [
                'university_id' => $university->university_id,
                'level_type' => 'group',
                'level_id' => $groupId,
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
        $name = str_replace(['«', '»', '"'], '', $name);

        // убрать двойные пробелы
        $name = preg_replace('/\s+/', ' ', $name);

        return trim($name);
    }

    private function findUniversityFuzzy($name, $groupId)
    {
        if ($name === "Академия «Болашак»" || $name === "Академия «Болашақ»")
        {
            $name = 'Академия «Болашак» (г. Караганда)';
        }
        $input = mb_strtolower(trim($name));
        $universities = UniversityName::all();

        $bestMatch = null;
        $highestPercent = 0;
        $foundUniversities = [];
        foreach ($universities as $university)
        {

            similar_text($input, mb_strtolower($university->name) , $percent);

            if ($percent > $highestPercent)
            {
                $highestPercent = $percent;
                $bestMatch = $university;

            }
        }
        if ($highestPercent < 82)
        {

            if ($bestMatch)
            {
                $this->warn("Для группы {$groupId}:Самый подходящий вуз: {$bestMatch->name} (ID: {$bestMatch->university_id}) with similarity: $highestPercent%\n");
            }
            else
            {
                $this->warn("Для группы {$groupId}: Не найден подходящий вуз для '{$name} '\n");
            }
            $universities = UniversityName::all();

            foreach ($universities as $university)
            {

                if (str_contains(mb_strtolower($input) , mb_strtolower($university->name)))
                {
                    $foundUniversities[] = $university;
                }
            }
            if (count($foundUniversities) > 0)
            {
                $this->info("Возможные совпадения для '{$name}':");
                foreach ($foundUniversities as $university)
                {
                    $this->info("- {$university->name} (ID: {$university->university_id})");
                }
            }
            else
            {
                $this->warn("Не найдено совпадений для вуза '{$name}' с использованием поиска по подстроке.");
            }
        }
        else $foundUniversities[] = $bestMatch;
        return $foundUniversities;
    }
}

