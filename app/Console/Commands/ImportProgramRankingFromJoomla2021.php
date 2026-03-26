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

class ImportProgramRankingFromJoomla2021 extends Command
{
    protected $signature = 'import:program-ranking-2021';
    protected $description = 'Import program ranking 2021 from old Joomla site';

    public function handle()
    {
        $this->info('Начинаем импорт программного рейтинга 2021...');

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

            if (!$year || $year != 2021) continue;

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
                        //echo "Processing field: $fieldName, article ID: $articleId\n";
                        if (!$articleId) continue;

                        $material = DB::connection('joomla')->table('f463o_k2_items')
                            ->where('id', $articleId)->first();

                        if (!$material) continue;
                        // 4️⃣ Материал направлений
                        $crawler = new Crawler(trim($material->introtext));

                        $headingText = $crawler->filter('.c_heading h4')->text();

                        preg_match('/«([^»]+)»/u', $headingText, $matches);

                        $inside = $matches[1] ?? '';
                        [$areaCode, $areaName] = explode(' ', $inside, 2);

                        $field->update([                            
                            'code' => $areaCode,
                        ]);
                        $this->info("Область: $areaName (код: $areaCode)");
                        // 1️⃣ Найти все направления
                        $crawler->filter('table.spoiler td')->each(function (Crawler $td) use ($year, $degree, $field) {
                            $html = $td->html();

                            if (str_contains($html, 'Направление подготовки')) {
                                preg_match('/\{spoiler title=([^}]+) opened=0\}/u', $html, $matches);

                                $title = $matches[1] ?? null;

                                preg_match('/«(\S+)\s+(.+)»/u', trim($title), $m);

                                $directionCode = $m[1] ?? null;
                                $directionName = $m[2] ?? null;
                                
                               // if (!$directionCode) return;
                                
                                //$newDirectionName =  mb_strtolower(trim($directionName), 'UTF-8');

                                //!!!****$direction = $this->findNameFuzzy($directionName, Direction::class, $field->id);
                                
                                
                                /*$direction = Direction::whereRaw('LOWER(name) = ?', [
                                    $newDirectionName
                                ])
                                ->where('field_id', $field->id)
                                ->first();
                                if($direction) {
                                    echo "Found existing direction: {$direction->name} (ID: {$direction->id}) for incoming direction: $directionName\n";
                                } else {
                                    $this->warn("No exact match found for direction: $directionName. Normalized: $newDirectionName\n");
                                }*/
                                $directionName = mb_strtoupper(mb_substr(mb_strtolower(trim($directionName), 'UTF-8'), 0, 1, 'UTF-8'), 'UTF-8')
                                        . mb_substr(mb_strtolower(trim($directionName), 'UTF-8'), 1, null, 'UTF-8');

                               /* if ($direction) {                                    
                                    $direction->update(
                                        [
                                        'field_id' => $field->id,
                                        'code' => $directionCode
                                        ]
                                    );                                    
                                } else {
                                    // если не нашли — создаём новое
                                    $direction = Direction::create([
                                        'field_id' => $field->id,
                                        'name' => $directionName,
                                        'code' => $directionCode,
                                        'year' => $year
                                    ]);
                                }*/
                                $direction = Direction::firstOrCreate([
                                        'field_id' => $field->id,
                                        'name' => $directionName,
                                        'code' => $directionCode,
                                        'year' => $year
                                    ]);
                                $count = $td->filter('.card')
                                    ->count();
                                    dump("Groups count is: $count");
                               
                                $td->filter('.card')->each(function (Crawler $card) use ($direction, $year) {

                                    $groupName = $card
                                        ->filter('.group-name span')
                                        ->text();

                                    
                                    preg_match('/«([^»]+)»/u', $groupName, $matches);

                                    $inside = $matches[1] ?? '';

                                    [$groupCode, $groupName] = explode(' ', $inside, 2);                                 

                                    if (!$groupCode) return;

                                    $groupName = mb_strtolower($groupName, 'UTF-8');
                                    $groupName = mb_strtoupper(mb_substr($groupName, 0, 1, 'UTF-8'), 'UTF-8')
                                            . mb_substr($groupName, 1, null, 'UTF-8');

                                    /*$group = Group::updateOrCreate(
                                        [
                                            'name' => $groupName,
                                            'code' => $groupCode,
                                            'direction_id' => $direction->id,
                                        ],
                                        [
                                            'name' => $groupName,
                                            'code' => $groupCode,
                                            'direction_id' => $direction->id,
                                        ]);*/
                                    $group = Group::firstOrCreate(
                                        [
                                            'name' => $groupName,
                                            'direction_id' => $direction->id,
                                            'year' => $year
                                        ],
                                        [
                                            'name' => $groupName,
                                            'code' => $groupCode,
                                            'direction_id' => $direction->id,
                                            'year' => $year
                                        ]
                                    );
                                    /*$group = $this->findNameFuzzy($groupName, Group::class, $direction->id);
                                    return;
                                    if ($group) {
                                        // если direction_id неправильный — обновляем
                                        if (!$group->direction_id) {
                                            echo "Не совпадает direction_id for group: {$group->name}\n";
                                            if (!$group->code)
                                                $this->warn("Обновляем direction_id: {$group->direction_id} на {$direction->id}\n");
                                            else
                                                $this->warn("НЕ обновляем direction_id: {$group->direction_id} на {$direction->id}\n");
                                        }
                                                                             
                                        $group->update([
                                            'direction_id' => $direction->id,
                                            'code' => $groupCode
                                        ]);
                                                                            
                                    } else {
                                        // если не нашли — создаём новое
                                        $group = Group::create([
                                            'name' => $groupName,
                                            'code' => $groupCode,
                                            'direction_id' => $direction->id,
                                        ]);
                                    }*/

                                    // 4️⃣ Найти ссылку "Показать все"
                                    $showAll = $card
                                        ->filterXPath('.//a[contains(.,"Показать все")]')
                                        ->first();

                                    if (!$showAll->count()) return;

                                    $href = $showAll->attr('href');
                                    
                                    preg_match('/\/item\/(\d+)/', $href, $m);

                                    $itemId = $m[1] ?? null;

                                    if (!$itemId) return;

                                    $this->parseFullGroupRanking2021(
                                        $itemId,
                                        $group,
                                        $year
                                    );
                                });
                            }
                        });
                       
                       /* $headings = $crawler->filter('a.heading2, a.heading');
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
                            $direction = Direction::firstOrCreate(['name' => $directionName, 'field_id' => $field->id, ]);

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
                                        $group = Group::firstOrCreate(['code' => $groupCode, 'name' => $groupName, 'direction_id' => $direction->id, ], ['code' => $groupCode, 'name' => $groupName, 'direction_id' => $direction->id, ]);

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
                                            

                                            $this->parseMaterial($material, $year, $degree, $group->id);
                                        }

                                    });
                                }

                                $next = $next->nextSibling;
                            }
                            
                        }*/

                    }
                }
            }
        }
        $this->info('Импорт завершён.');
    }

    private function findNameFuzzy($name, $modelClass, $parentId)
    {
        $highest = 0;
        $bestMatch = null;
        $parentClass = $modelClass === Direction::class ? 'field_id' : 'direction_id';
        $name = mb_strtolower(trim($name), 'UTF-8');

        foreach ($modelClass::all()->where($parentClass, $parentId) as $model) {

            $dbName = mb_strtolower(trim($model->name), 'UTF-8');

            similar_text($dbName, $name, $percent);

            if ($percent > $highest) {
                $highest = $percent;
                $bestMatch = $model;
            }
        }

        echo "<tr> <td>{$parentClass}</td><td>{$parentId}</td><td>{$name}</td><td>" . ($bestMatch ? $bestMatch->name : 'null') . "</td><td>{$highest}%</td></tr>\n";

        return $bestMatch;
    }

    private function parseFullGroupRanking2021(
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

