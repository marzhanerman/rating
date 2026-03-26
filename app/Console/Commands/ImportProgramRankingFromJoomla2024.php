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

class ImportProgramRankingFromJoomla2024 extends Command
{
    protected $signature = 'import:program-ranking-2024';
    protected $description = 'Import program ranking 2024 from old Joomla site';

    public function handle()
    {
        $this->info('Начинаем импорт программного рейтинга 2024...');

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

            if (!$year || $year != 2024) continue;

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
                        if ($field->wasRecentlyCreated) {
                            echo "Создана новая запись: {$degree} {$field->name}\n";
                        } 
                        preg_match('/id=(\d+)/', $fieldCategory->link, $matches);
                        $articleId = $matches[1] ?? null;
                        
                        if (!$articleId) continue;

                        $material = DB::connection('joomla')->table('f463o_k2_items')
                            ->where('id', $articleId)->first();

                        if (!$material) continue;
                        // 4️⃣ Материал областей
                        $crawler = new Crawler(trim($material->introtext));

                        $headingText = $crawler->filter('.c_heading h4')->text();

                        preg_match('/«([^»]+)»/u', $headingText, $matches);

                        $inside = $matches[1] ?? '';
                        [$areaCode, $areaName] = explode(' ', $inside, 2);
                        if (!$areaCode) continue;
                        if($areaCode!=$field->code) {
                            /*$field->update([                            
                                'code' => $areaCode,
                            ]);*/
                            $this->warn("Не совпадает код: $field->name (код: $areaCode)");
                        }
                        // 1️⃣ Найти все направления
                        $crawler->filter('table.spoiler td')->each(function (Crawler $td) use ($year, $degree, $field) {
                            $directionNode = $td->filter('p');

                            if (!$directionNode->count()) return;

                            $directionText = $directionNode->text();

                            preg_match('/«([^»]+)»/u', $directionText, $m);

                            [$directionCode, $directionName] = explode(' ', $m[1], 2);

                            $direction = Direction::firstOrCreate(
                                [
                                    'field_id' => $field->id,
                                    'name' => $directionName,
                                    'code' => $directionCode,
                                ],
                                [
                                    'field_id' => $field->id,
                                    'name' => $directionName,
                                    'code' => $directionCode,
                                    'year' => $year
                                ]);
                            if ($direction->wasRecentlyCreated) {
                                echo "Создана новая запись: {$degree} {$direction->name}\n";
                            } 


                            $td->filter('.card')->each(function (Crawler $card) use ($direction, $year) {
                                $groupText = $card
                                    ->filter('.group-name')
                                    ->text();

                                preg_match('/«([^»]+)»/u', $groupText, $m);

                                [$groupCode, $groupName] = explode(' ', $m[1], 2);

                                if (!$groupCode) return;

                                // Нормализуем русские буквы
                                $groupCode = str_replace(['М', 'В'], ['M', 'B'], $groupCode);

                                $group = $this->findNameFuzzy($groupName, $groupCode, Group::class, $direction->id, $year);
                                

                                
                                $directionCode = $direction->code ?? 'null';
                                $card->filter('table tr')->each(function (Crawler $row, $i) use ($directionCode, $groupCode, $year, $group) {

                                    if ($i === 0) return; // пропустить заголовок

                                    $cols = $row->filter('td');

                                    if ($cols->count() < 3) return;

                                    $rank = (int) trim(str_replace('.', '', $cols->eq(0)->text()));

                                    $universityName = trim($cols->eq(1)->filter('b')->text());

                                    $foundUniversities = $this->findUniversityFuzzy($universityName, $groupCode);
                                    $k=0;
                                    foreach ($foundUniversities as $university)
                                    {
                                    
                                        $programs = [];

                                        $cols->eq(1)->filter('ul li')->each(function (Crawler $li) use (&$programs) {

                                            $text = trim($li->text());

                                            [$code, $name] = explode(' - ', $text, 2);

                                            $programs[] = [
                                                'code' => trim($code),
                                                'name' => trim($name)
                                            ];
                                        });

                                        $score = (float) trim($cols->eq(2)->text());

                                        Ranking2::updateOrCreate(
                                            [
                                                'year' => $year,
                                                'university_id' => $university->university_id,
                                                'level_type' => 'group',
                                                'level_id' => $group->id,                                                
                                            ],
                                            [
                                                'rank' => $rank,
                                                'score' => $score,
                                                'programs' => $programs,
                                            ]
                                        );
                                        
                                        //echo "<tr><td>{$university->name}</td><td>{$rank}</td><td>{$score}</td><td>" . json_encode($programs, JSON_UNESCAPED_UNICODE) . "</td></tr>\n";   
                                        
                                    }
                                });
                            });
                        });
                       
                       

                    }
                }
            }
        }
        $this->info('Импорт завершён.');
    }

    private function findNameFuzzy($name, $code, $modelClass, $parentId, $year)
    {
        $highest = 0;
        $bestMatch = null;
        $parentClass = $modelClass === Direction::class ? 'field_id' : 'direction_id';

        foreach ($modelClass::all()->where($parentClass, $parentId) as $model) {

            $dbName = mb_strtolower(trim($model->name), 'UTF-8');

            similar_text($dbName, mb_strtolower(trim($name), 'UTF-8'), $percent);

            if ($percent > $highest) {
                $highest = $percent;
                $bestMatch = $model;
            }
        }

        //echo "<tr> <td>{$parentClass}</td><td>{$parentId}</td><td>{$code} - {$name}</td><td>" . ($bestMatch ? $bestMatch->code . ' - ' . $bestMatch->name : 'null') . "</td><td>{$highest}%</td></tr>\n";

        
        // Сохраняем группу
        $group = $modelClass::firstOrCreate(
            [
                $parentClass => $parentId,
                'name' => $name,
                'code' => $code,
            ],
            [
                $parentClass => $parentId,
                'name' => $name,
                'code' => $code,
                'year' => $year
            ]);
        if ($group->wasRecentlyCreated) {
            echo "Создана новая запись: {$group->code} {$group->name}\n";
        } 
        
        return $group;
    }

    private function parseFullGroupRanking2024(
        int $itemId,
        Group $group,
        int $year
    )
    {
        $item = DB::connection('joomla')
            ->table('f463o_k2_items')
            ->where('id', $itemId)
            ->first();

        if (!$item) return;

        $html = $item->fulltext ?: $item->introtext;

        $crawler = new Crawler($html);
        $currentRank = null;
        $crawler->filter('table tbody tr')
            ->each(function (Crawler $row) use ($group, $year, &$currentRank) {

                $cols = $row->filter('td');                

                if ($cols->count() < 3){
                    // слишком мало колонок — пропускаем
                    //$this->info("Пропускаем строку с недостаточным количеством колонок: " . $row->text());
                    return;
                } 

                $universityName = null;
                $rank = null;
                $score = null;
                $program_col = null;

                if ($cols->count() === 4)
                {
                    // обычная строка
                    $rank = (int)preg_replace('/\D/', '', $cols->eq(0)
                        ->text());
                    $currentRank = $rank;

                    $universityName = trim($cols->eq(1)
                        ->text());
                    $score = (float)str_replace(',', '.', trim($cols->eq(3)
                        ->text()));
                    $program_col = $cols->eq(2);
                }

                elseif ($cols->count() === 3)
                {
                    // строка из-за rowspan
                    $rank = $currentRank;

                    $universityName = trim($cols->eq(0)
                        ->text());
                    $score = (float)str_replace(',', '.', trim($cols->eq(2)
                        ->text()));
                    $program_col = $cols->eq(1);
                }

                if (!$universityName){
                    $this->info("Пропускаем строку без названия университета: " . $row->text());
                    return;
                }

                if (
                    str_contains($universityName, 'Наименование') ||
                    str_contains($universityName, 'Вуз')
                ) {
                    return;
                }         

                if (!is_numeric($rank)) return;

                $programs = [];

                if ($cols->eq(2)->filter('li')->count() > 0) {
                    $program_col->filter('li a')->each(function ($a) use (&$programs) {

                        $href = $a->attr('href'); // /item/14286
                        preg_match('/\/item\/(\d+)/', $href, $matches);
                        $id = $matches[1] ?? null;

                        $text = trim($a->text());

                        // Разделяем код и название
                        $parts = explode(' - ', $text, 2);

                        $code = trim($parts[0] ?? '');
                        $name = trim($parts[1] ?? '');

                        $programs[] = [
                            'id' => $id,
                            'code' => $code,
                            'name' => $name,
                        ];
                    });
                }
                

                $foundUniversities = $this->findUniversityFuzzy($universityName, $group->id);

                if (empty($foundUniversities))
                {
                    $this->warn("Не найден вуз: $universityName для группы: {$group->id}");
                    return;
                }

                foreach ($foundUniversities as $university)
                {
                    Ranking2::updateOrCreate(
                        [
                            'year' => $year,
                            'university_id' => $university->university_id,
                            'level_type' => 'group',
                            'level_id' => $group->id,                            
                        ],
                        [
                            'rank' => $rank,
                            'score' => (float) str_replace(',', '.', $score),
                            'programs' => $programs,
                        ]
                    );
                }
            });
    }

    private function normalizeName(string $value): string
    {
        $value = trim($value);

        // привести к нижнему регистру
        $value = mb_strtolower($value);

        // заменить ё на е
        $value = str_replace('ё', 'е', $value);

        // убрать кавычки всех видов
        $value = str_replace(['«', '»', '"', '“', '”'], '', $value);

        // убрать лишние пробелы
        $value = preg_replace('/\s+/u', ' ', $value);

        /* Физика-Информатика
        Физика – Информатика
        Физика Информатика*/
        $value = preg_replace('/[.,\-–—]/u', '', $value);

        // убрать пробелы по краям
        $value = trim($value);

        return $value;
    }

    private function normalizeDegree($title)
    {
        $title = mb_strtolower($title);

        if (str_contains($title, 'бакалавр')) return 'bachelor';
        if (str_contains($title, 'магистр')) return 'master';
        if (str_contains($title, 'докторан')) return 'phd';

        return null;
    }

    private function findUniversityFuzzy($name, $groupCode)
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
                $this->warn("Для группы {$groupCode}:Самый подходящий вуз: {$bestMatch->name} (ID: {$bestMatch->university_id}) with similarity: $highestPercent%\n");
            }
            else
            {
                $this->warn("Для группы {$groupCode}: Не найден подходящий вуз для '{$name} '\n");
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

