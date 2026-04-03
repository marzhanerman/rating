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
use App\Helpers\StringHelper;

class ImportProgramRankingFromJoomla2025 extends Command
{
    protected $signature = 'import:program-ranking-2025';
    protected $description = 'Import program ranking 2025 from old Joomla site';

    public function handle()
    {
        $this->info('Начинаем импорт программного рейтинга 2025...');

        // 1️⃣ 
        $group_rating = DB::connection('rating_2025')->table('group_rating')->get();

        foreach ($group_rating as $record) {
            $group = DB::connection('rating_2025')->table('ep_groups')
                    ->where('id', $record->group_id)->first();
            $groupData = StringHelper::splitCodeAndName($group->name);
            $groupCode = $groupData['code'];
            $groupName = $groupData['name'];

            $direction = DB::connection('rating_2025')->table('ep_directions')
                    ->where('id', $group->direction_id)->first();
            $directionData = StringHelper::splitCodeAndName($direction->name);
            $directionCode = $directionData['code'];
            $directionName = $directionData['name'];

            $field = DB::connection('rating_2025')->table('ep_fields')
                    ->where('id', $direction->field_id)->first();
            $fieldData = StringHelper::splitCodeAndName($field->name);
            $fieldCode = $fieldData['code'];
            $fieldName = $fieldData['name'];
            $degree = $this->normalizeDegree($field->degree);
            //echo "Processing record: {$degree} {$fieldCode} - {$fieldName} | {$directionCode} - {$directionName} | {$groupCode} - {$groupName}\n";
            
            if (!$degree) continue;
            
            $field = Field::updateOrCreate(
                [                    
                    'name' => $fieldName,
                    'degree' => $degree,
                    'type' => 'new',
                ],
                [
                    'code' => $fieldCode,
                ]
            );
            if ($field->wasRecentlyCreated) {
                echo "Создана новый field: {$field->code} {$field->name}\n";
            } 
            elseif ($field->wasChanged()) {
                echo "Обновлён field: {$field->code} {$field->name}\n";
            }

            $direction = $this->findNameFuzzy($directionName, $directionCode, Direction::class, $field->id, 2025);
            
            $group = $this->findNameFuzzy($groupName, $groupCode, Group::class, $direction->id, 2025);

            $university = DB::connection('rating_2025')->table('heis')
                    ->where('id', $record->hei_id)->first();
              
            $universityName = $university->name_ru;

            $foundUniversities = $this->findUniversityFuzzy($universityName, $groupCode);
            if(count($foundUniversities) === 0 || count($foundUniversities) > 1) {
                $this->warn("Не найден вуз: $universityName для группы: {$groupCode}");
                continue;
            }
            foreach ($foundUniversities as $university)
            {           

                Ranking2::updateOrCreate(
                    [
                        'year' => '2025',
                        'university_id' => $university->university_id,
                        'level_type' => 'group',
                        'level_id' => $group->id,                                                
                    ],
                    [
                        'rank' => $record->place,
                        'total_score' => $record->total_total,
                    ]
                );               
                
            }
            
        }

        
        $this->info('Импорт завершён.');
    }


    private function findNameFuzzy($name, $code, $modelClass, $parentId, $year)
    {
        $highest = 0;
        $bestMatch = null;
        $parentClass = $modelClass === Direction::class ? 'field_id' : 'direction_id';

        foreach ($modelClass::all()->where($parentClass, $parentId)
                                   ->where('year', '>', '2020') as $model) {

            $dbName = mb_strtolower(trim($model->name), 'UTF-8');

            similar_text($dbName, mb_strtolower(trim($name), 'UTF-8'), $percent);

            if ($percent > $highest) {
                $highest = $percent;
                $bestMatch = $model;
            }
        }

       // echo "<tr> <td>{$parentClass}</td><td>{$parentId}</td><td>{$code} - {$name}</td><td>" . ($bestMatch ? $bestMatch->code . ' - ' . $bestMatch->name : 'null') . "</td><td>{$highest}%</td></tr>\n";

        
        // Сохраняем группу
        if($highest < 85) {
             
        $bestMatch = $modelClass::create(
            [
                $parentClass => $parentId,
                'name' => $name,
                'code' => $code,
                'year' => $year
            ]);
        if ($bestMatch->wasRecentlyCreated) {
            echo "Создана новая запись: {$bestMatch->code} {$bestMatch->name}\n";
        } 
        }
        /*else {
            echo "Найдена существующая запись: {$bestMatch->code} {$bestMatch->name} с совпадением {$highest}%\n";
        }*/
        
        return $bestMatch;
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
                            'total_score' => (float) str_replace(',', '.', $score),
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

        if (str_contains($title, '6b')) return 'bachelor';
        if (str_contains($title, '7m')) return 'master';
        if (str_contains($title, '8d')) return 'phd';

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

