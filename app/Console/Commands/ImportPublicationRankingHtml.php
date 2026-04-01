<?php

namespace App\Console\Commands;

use App\Models\PublicationRanking;
use App\Models\PublicationRankingMethodology;
use App\Models\University;
use App\Models\UniversityName;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Symfony\Component\DomCrawler\Crawler;

class ImportPublicationRankingHtml extends Command
{
    protected $signature = 'import:publication-ranking-html
        {path : Path to the HTML file}
        {--year= : Force year if it cannot be detected from the heading}
        {--truncate : Delete imported records for the year before import}';

    protected $description = 'Import publication ranking methodology and rows from an HTML export';

    private Collection $universityAliases;
    private Collection $universities;
    private array $unmatchedRows = [];
    private array $manualAliasOverrides = [
        'высшая школа общественного здравоохранения' => 56,
        'университет международного бизнеса имени кенжегали сагадиева' => 110,
        'аlikhаn воkеikhаn univеrsity' => 44,
        'евразийской юридической академии имени д а кунаева' => 109,
        'академия туризма и спорта' => 37,
        'академия bolashaq' => 5,
        'академия bolashaq караганда' => 5,
        'academy bolashaq' => 5,
        'евразийская юридическая академия имени д а кунаева' => 109,
        'евразийский гуманитарный институт имени а к кусаинова' => 25,
        'есиль университет' => 2,
        'сатпаев университет' => 3,
        'академия болашак' => 5,
        'академия кайнар' => 101,
        'баишев университет' => 12,
        'университет алихана бокейхана' => 44,
        'евразийская юридическая академия имени д кунаева' => 109,
    ];

    public function handle(): int
    {
        $path = $this->resolvePath((string) $this->argument('path'));

        if (!$path || !is_file($path)) {
            $this->error('HTML file not found.');

            return self::FAILURE;
        }

        $html = file_get_contents($path);

        if ($html === false || trim($html) === '') {
            $this->error('Unable to read HTML content.');

            return self::FAILURE;
        }

        $this->loadUniversityLookups();

        $crawler = new Crawler($html);
        $blocks = $crawler->filter('.itemFullText');

        if ($blocks->count() === 0) {
            $this->error('No .itemFullText blocks were found in the HTML.');

            return self::FAILURE;
        }

        $forcedYear = $this->option('year') ? (int) $this->option('year') : null;
        $importedYear = $forcedYear;

        if ($this->option('truncate') && $forcedYear) {
            PublicationRanking::query()->where('year', $forcedYear)->delete();
            PublicationRankingMethodology::query()->where('year', $forcedYear)->delete();
        }

        $methodologySaved = false;
        $rowsImported = 0;

        foreach ($blocks as $blockNode) {
            $block = new Crawler($blockNode);
            $heading = trim(html_entity_decode($block->filter('.c_heading h4')->count() ? $block->filter('.c_heading h4')->text() : '', ENT_QUOTES | ENT_HTML5, 'UTF-8'));

            if ($heading === '') {
                continue;
            }

            if (str_contains(mb_strtolower($heading), 'методология рейтинга вузов по научным публикациям')) {
                $year = $forcedYear ?? $this->extractYear($heading);

                if (!$year) {
                    $this->warn("Не удалось определить год методологии: {$heading}");
                    continue;
                }

                $importedYear ??= $year;

                if ($this->option('truncate') && !$methodologySaved && !$forcedYear) {
                    PublicationRanking::query()->where('year', $year)->delete();
                    PublicationRankingMethodology::query()->where('year', $year)->delete();
                }

                $criteria = $this->parseMethodologyCriteria($block);

                PublicationRankingMethodology::updateOrCreate(
                    ['year' => $year],
                    [
                        'title' => $heading,
                        'criteria' => $criteria,
                        'html' => $this->outerHtml($blockNode),
                    ]
                );

                $methodologySaved = true;
                $this->info("Сохранена методология за {$year}.");

                continue;
            }

            if (!str_contains(mb_strtolower($heading), 'рейтинг') || !str_contains(mb_strtolower($heading), 'научным публикациям')) {
                continue;
            }

            $year = $forcedYear ?? $this->extractYear($heading);

            if (!$year) {
                $this->warn("Не удалось определить год рейтинга: {$heading}");
                continue;
            }

            $importedYear ??= $year;
            $inlineMethodology = $this->parseInlineMethodology($block);

            if ($inlineMethodology !== null) {
                PublicationRankingMethodology::updateOrCreate(
                    ['year' => $year],
                    [
                        'title' => $inlineMethodology['title'],
                        'criteria' => $inlineMethodology['criteria'],
                        'html' => $this->outerHtml($blockNode),
                    ]
                );

                $methodologySaved = true;
                $this->info("Сохранена методология за {$year}.");
            }

            $category = $this->extractCategory($heading);
            $table = $block->filter('table.table')->count() ? $block->filter('table.table')->first() : $block->filter('table')->last();

            if ($table->count() === 0) {
                $this->warn("В блоке '{$heading}' не найдена таблица.");
                continue;
            }

            $table->filter('tbody tr')->each(function (Crawler $row) use ($year, $category, &$rowsImported) {
                $cells = $row->filter('td');

                if ($cells->count() < 3) {
                    return;
                }

                $place = $this->parsePlace($cells->eq(0)->text());
                $universityName = trim(html_entity_decode($cells->eq(1)->text(), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
                $total = $this->parseDecimal($cells->eq(2)->text());

                if (!$place || $universityName === '') {
                    return;
                }

                $match = $this->findUniversityMatch($universityName);

                PublicationRanking::updateOrCreate(
                    [
                        'year' => $year,
                        'category' => $category,
                        'university' => $universityName,
                    ],
                    [
                        'place' => $place,
                        'total' => $total,
                        'university_id' => $match['university_id'],
                        'matched_by' => $match['matched_by'],
                        'match_percent' => $match['match_percent'],
                    ]
                );

                if (!$match['university_id']) {
                    $this->unmatchedRows[] = [
                        'year' => $year,
                        'category' => $category,
                        'university' => $universityName,
                    ];
                }

                $rowsImported++;
            });

            $this->info("Импортирована категория '{$category}' за {$year}.");
        }

        if ($rowsImported === 0 && !$methodologySaved) {
            $this->warn('Ничего не было импортировано. Возможно, HTML неполный или отличается по структуре.');
        }

        $this->info("Год: " . ($importedYear ?? 'не определён'));
        $this->info("Сохранено строк рейтинга: {$rowsImported}");

        if (count($this->unmatchedRows) > 0) {
            $this->warn('Есть строки без найденного university_id:');

            foreach ($this->unmatchedRows as $row) {
                $this->line("- {$row['year']} / {$row['category']} / {$row['university']}");
            }
        }

        return self::SUCCESS;
    }

    private function parseMethodologyCriteria(Crawler $block): array
    {
        $table = $block->filter('table')->first();

        if ($table->count() === 0) {
            return [];
        }

        $criteria = [];

        $table->filter('tbody tr')->each(function (Crawler $row, int $index) use (&$criteria) {
            if ($index === 0) {
                return;
            }

            $cells = $row->filter('td');

            if ($cells->count() < 3) {
                return;
            }

            $number = trim($cells->eq(0)->text());
            $criterion = trim(html_entity_decode($cells->eq(1)->text(), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
            $points = $this->parseDecimal($cells->eq(2)->text());

            if ($number === '' || $criterion === '') {
                return;
            }

            $criteria[] = [
                'number' => $number,
                'criterion' => preg_replace('/\s+/u', ' ', $criterion),
                'points' => $points,
            ];
        });

        return $criteria;
    }

    private function parseInlineMethodology(Crawler $block): ?array
    {
        $blockHtml = $this->outerHtml($block->getNode(0));
        $methodologyHtml = preg_split('/<table\b/i', $blockHtml, 2)[0] ?? $blockHtml;
        $fragment = new Crawler('<div>' . $methodologyHtml . '</div>');
        $paragraphs = $fragment->filter('p');

        if ($paragraphs->count() === 0) {
            return null;
        }

        $lines = [];

        $paragraphs->each(function (Crawler $paragraph) use (&$lines) {
            $text = trim(html_entity_decode($paragraph->text(), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
            $text = preg_replace('/\s+/u', ' ', $text);

            if ($text !== '') {
                $lines[] = $text;
            }
        });

        if ($lines === []) {
            return null;
        }

        $joined = mb_strtolower(implode(' ', $lines), 'UTF-8');

        if (!str_contains($joined, 'методолог')) {
            return null;
        }

        $heading = trim(html_entity_decode($block->filter('.c_heading h4')->count() ? $block->filter('.c_heading h4')->text() : '', ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        $year = $this->extractYear($heading);

        $criteria = [];

        foreach ($lines as $line) {
            $cleanLine = ltrim($line, "-–— \t");
            $points = null;
            $criterion = $cleanLine;

            if (preg_match('/^(.*?)\s*-\s*(\d+(?:[.,]\d+)?)\s*%?;?$/u', $cleanLine, $matches)) {
                $criterion = trim($matches[1]);
                $points = $this->parseDecimal($matches[2]);
            }

            $criteria[] = [
                'number' => null,
                'criterion' => $criterion,
                'points' => $points,
            ];
        }

        return [
            'title' => $year ? "Методология рейтинга вузов по научным публикациям {$year}" : $heading,
            'criteria' => $criteria,
        ];
    }

    private function extractCategory(string $heading): ?string
    {
        if (preg_match('/^Рейтинг\s+(.+?)\s+по научным публикациям/u', $heading, $matches)) {
            $category = trim($matches[1]);

            return mb_strtolower($category) === 'вузов' ? null : $category;
        }

        return null;
    }

    private function extractYear(string $heading): ?int
    {
        if (preg_match('/(20\d{2})/u', $heading, $matches)) {
            return (int) $matches[1];
        }

        return null;
    }

    private function parsePlace(string $value): ?int
    {
        $digits = preg_replace('/[^\d]/u', '', $value);

        return $digits !== '' ? (int) $digits : null;
    }

    private function parseDecimal(string $value): ?float
    {
        $normalized = str_replace([' ', "\xc2\xa0"], '', trim($value));
        $normalized = str_replace(',', '.', $normalized);
        $normalized = preg_replace('/[^0-9.\-]/', '', $normalized);

        return $normalized !== '' ? (float) $normalized : null;
    }

    private function findUniversityMatch(string $rawName): array
    {
        $variants = collect($this->extractNameVariants($rawName))
            ->map(fn (string $variant) => $this->normalizeUniversityName($variant))
            ->filter()
            ->push($this->normalizeUniversityName($rawName))
            ->unique()
            ->values();

        foreach ($variants as $normalized) {
            $override = $this->manualAliasOverrides[$normalized] ?? null;

            if ($override) {
                if (is_int($override)) {
                    return [
                        'university_id' => $override,
                        'matched_by' => 'override:id',
                        'match_percent' => 100,
                    ];
                }

                $exactAlias = $this->universityAliases->first(fn (array $item) => $item['normalized'] === $override);
                if ($exactAlias) {
                    return [
                        'university_id' => $exactAlias['university_id'],
                        'matched_by' => 'override:university_names',
                        'match_percent' => 100,
                    ];
                }

                $exactUniversity = $this->universities->first(fn (array $item) => $item['normalized'] === $override);
                if ($exactUniversity) {
                    return [
                        'university_id' => $exactUniversity['id'],
                        'matched_by' => 'override:universities',
                        'match_percent' => 100,
                    ];
                }
            }

            $exactAlias = $this->universityAliases->first(fn (array $item) => $item['normalized'] === $normalized);
            if ($exactAlias) {
                return [
                    'university_id' => $exactAlias['university_id'],
                    'matched_by' => 'exact:university_names',
                    'match_percent' => 100,
                ];
            }

            $exactUniversity = $this->universities->first(fn (array $item) => $item['normalized'] === $normalized);
            if ($exactUniversity) {
                return [
                    'university_id' => $exactUniversity['id'],
                    'matched_by' => 'exact:universities',
                    'match_percent' => 100,
                ];
            }
        }

        $bestMatch = [
            'university_id' => null,
            'matched_by' => null,
            'match_percent' => null,
        ];
        $bestPercent = 0.0;

        foreach ($variants as $normalized) {
            foreach ($this->universityAliases as $item) {
                similar_text($normalized, $item['normalized'], $percent);

                if ($percent > $bestPercent) {
                    $bestPercent = $percent;
                    $bestMatch = [
                        'university_id' => $item['university_id'],
                        'matched_by' => 'similar_text:university_names',
                        'match_percent' => round($percent, 2),
                    ];
                }
            }

            foreach ($this->universities as $item) {
                similar_text($normalized, $item['normalized'], $percent);

                if ($percent > $bestPercent) {
                    $bestPercent = $percent;
                    $bestMatch = [
                        'university_id' => $item['id'],
                        'matched_by' => 'similar_text:universities',
                        'match_percent' => round($percent, 2),
                    ];
                }
            }
        }

        if ($bestPercent >= 80) {
            return $bestMatch;
        }

        return [
            'university_id' => null,
            'matched_by' => null,
            'match_percent' => null,
        ];
    }

    private function extractNameVariants(string $rawName): array
    {
        $variants = [];
        $decoded = html_entity_decode($rawName, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        $variants[] = $decoded;

        if (preg_match('/^(.*?),/u', $decoded, $matches)) {
            $variants[] = trim($matches[1]);
        }

        if (preg_match('/^(.*?)\(/u', $decoded, $matches)) {
            $variants[] = trim($matches[1]);
        }

        if (preg_match('/(?:бывш?\.?|быв\.?)\s*-?\s*([^)]+)/ui', $decoded, $matches)) {
            $variants[] = trim($matches[1]);
        }

        if (preg_match('/прежнее название\s*-\s*([^)]+)/ui', $decoded, $matches)) {
            $variants[] = trim($matches[1]);
        }

        return array_values(array_unique(array_filter($variants)));
    }

    private function loadUniversityLookups(): void
    {
        $this->universityAliases = UniversityName::query()
            ->get(['university_id', 'name'])
            ->map(fn (UniversityName $item) => [
                'university_id' => $item->university_id,
                'name' => $item->name,
                'normalized' => $this->normalizeUniversityName($item->name),
            ])
            ->values();

        $this->universities = University::query()
            ->get(['id', 'current_name'])
            ->map(fn (University $item) => [
                'id' => $item->id,
                'name' => $item->current_name,
                'normalized' => $this->normalizeUniversityName($item->current_name),
            ])
            ->values();
    }

    private function normalizeUniversityName(string $value): string
    {
        $value = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $value = strip_tags($value);
        $value = preg_replace('/,\s*г\.?\s*[^\s,).]+/ui', '', $value);
        $value = preg_replace('/\([^)]*прежнее название[^)]*\)/ui', '', $value);
        $value = preg_replace('/\([^)]*\)/u', '', $value);
        $value = str_replace(['«', '»', '"', '“', '”', '„'], '', $value);

        $latinToCyrillic = [
            'A' => 'А', 'B' => 'В', 'C' => 'С', 'E' => 'Е', 'H' => 'Н', 'K' => 'К',
            'M' => 'М', 'O' => 'О', 'P' => 'Р', 'T' => 'Т', 'X' => 'Х',
            'a' => 'а', 'c' => 'с', 'e' => 'е', 'o' => 'о', 'p' => 'р', 'x' => 'х',
        ];

        $value = strtr($value, $latinToCyrillic);
        $value = mb_strtolower($value, 'UTF-8');
        $value = str_replace('ё', 'е', $value);
        $value = preg_replace('/[.,:;\/\\\\\-–—]/u', ' ', $value);
        $value = preg_replace('/\s+/u', ' ', $value);

        return trim($value);
    }

    private function resolvePath(string $path): ?string
    {
        if (is_file($path)) {
            return realpath($path) ?: $path;
        }

        $storagePath = storage_path($path);

        if (is_file($storagePath)) {
            return realpath($storagePath) ?: $storagePath;
        }

        return null;
    }

    private function outerHtml(\DOMNode $node): string
    {
        return $node->ownerDocument?->saveHTML($node) ?? '';
    }
}
