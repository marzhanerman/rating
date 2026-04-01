<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\DomCrawler\Crawler;

class WebsiteRankingController extends Controller
{
    public function index(Request $request): Response
    {
        $archive = $this->loadWebsiteRankingArchive();

        $yearOptions = $archive
            ->map(fn (array $yearData) => [
                'year' => $yearData['year'],
                'entryCount' => $yearData['entryCount'],
                'categoryCount' => $yearData['categoryCount'],
                'metricCount' => $yearData['metricCount'],
                'hasMethodology' => $yearData['methodology'] !== null,
                'hasDetailedMetrics' => $yearData['metricCount'] > 0,
                'topScore' => $yearData['topScore'],
                'modeLabel' => $yearData['categoryCount'] > 1 ? 'Профильные категории' : 'Единый список',
            ])
            ->values();

        $selectedYear = (int) $request->integer('year');
        $availableYears = $yearOptions->pluck('year')->all();

        if (!$selectedYear || !in_array($selectedYear, $availableYears, true)) {
            $selectedYear = (int) ($yearOptions->first()['year'] ?? now()->year);
        }

        $selectedRating = $archive->firstWhere('year', $selectedYear);

        return Inertia::render('website_ranking', [
            'selectedYear' => $selectedYear,
            'selectedRating' => $selectedRating,
            'yearOptions' => $yearOptions,
        ]);
    }

    private function loadWebsiteRankingArchive(): Collection
    {
        try {
            $items = DB::table('joomla_old.f463o_k2_items')
                ->select('id', 'title', 'introtext', 'fulltext', 'published', 'trash')
                ->where('trash', 0)
                ->where(function ($query) {
                    $query->where('title', 'like', 'Рейтинг%сайт%')
                        ->orWhere('title', 'like', 'Рейтинг веб-сайтов%')
                        ->orWhere('title', 'like', 'Методология рейтинга веб-сайтов%');
                })
                ->orderByDesc('id')
                ->get();
        } catch (\Throwable) {
            return collect();
        }

        $deduplicated = [];

        foreach ($items as $item) {
            if (!$this->shouldUseArchiveItem((string) $item->title)) {
                continue;
            }

            $year = $this->extractYear((string) $item->title);

            if ($year === null) {
                continue;
            }

            $category = $this->extractCategory((string) $item->title);
            $type = $this->isMethodologyTitle((string) $item->title) ? 'methodology' : 'ranking';
            $key = implode('|', [
                $year,
                $category['key'] ?? 'all',
                $type,
            ]);

            if (!array_key_exists($key, $deduplicated)) {
                $deduplicated[$key] = $item;
            }
        }

        $years = [];

        foreach ($deduplicated as $item) {
            $title = (string) $item->title;
            $year = $this->extractYear($title);

            if ($year === null) {
                continue;
            }

            $combinedHtml = $this->prepareHtml((string) $item->introtext . (string) $item->fulltext);
            $category = $this->extractCategory($title);

            if (!isset($years[$year])) {
                $years[$year] = [
                    'year' => $year,
                    'title' => "Рейтинг веб-сайтов вузов Казахстана - {$year}",
                    'entryCount' => 0,
                    'categoryCount' => 0,
                    'metricCount' => 0,
                    'topScore' => null,
                    'metricColumns' => [],
                    'categories' => [],
                    'methodology' => null,
                ];
            }

            if ($this->isMethodologyTitle($title)) {
                $years[$year]['methodology'] = $this->parseMethodologyTable($combinedHtml, $title, $year)
                    ?? $years[$year]['methodology'];

                continue;
            }

            $parsedRanking = $this->parseRankingTable($combinedHtml, $title, $year);

            if ($parsedRanking['rows'] === []) {
                continue;
            }

            $categoryKey = $category['key'] ?? 'all';
            $categoryLabel = $category['label'] ?? 'Общий рейтинг';
            $categoryScore = $parsedRanking['topScore'];

            $years[$year]['categories'][$categoryKey] = [
                'key' => $categoryKey,
                'label' => $categoryLabel,
                'entryCount' => count($parsedRanking['rows']),
                'topScore' => $categoryScore,
                'rows' => $parsedRanking['rows'],
            ];

            foreach ($parsedRanking['metricColumns'] as $metricColumn) {
                $years[$year]['metricColumns'][$metricColumn['key']] = $metricColumn;
            }

            if ($years[$year]['methodology'] === null) {
                $years[$year]['methodology'] = $this->parseInlineMethodology($combinedHtml, $title, $year);
            }
        }

        return collect($years)
            ->map(function (array $yearData) {
                $categories = collect($yearData['categories'])
                    ->sortBy(fn (array $category) => $category['rows'][0]['place'] ?? 9999)
                    ->values()
                    ->all();
                $categoryCount = count($categories);

                $allRows = collect($categories)
                    ->flatMap(fn (array $category) => $category['rows'])
                    ->values();

                $topScore = $allRows
                    ->pluck('totalScore')
                    ->filter(fn ($value) => $value !== null)
                    ->max();

                $title = $categoryCount > 1
                    ? "Рейтинг веб-сайтов вузов Казахстана - {$yearData['year']}"
                    : ($categories[0]['label'] ?? "Рейтинг веб-сайтов вузов Казахстана - {$yearData['year']}");

                if ($categoryCount <= 1) {
                    $title = "Рейтинг веб-сайтов вузов Казахстана - {$yearData['year']}";
                }

                return [
                    'year' => $yearData['year'],
                    'title' => $title,
                    'entryCount' => $allRows->count(),
                    'categoryCount' => $categoryCount,
                    'metricCount' => count($yearData['metricColumns']),
                    'topScore' => $topScore !== null ? (float) $topScore : null,
                    'metricColumns' => array_values($yearData['metricColumns']),
                    'categories' => $categories,
                    'methodology' => $yearData['methodology'],
                ];
            })
            ->sortByDesc('year')
            ->values();
    }

    private function shouldUseArchiveItem(string $title): bool
    {
        if ($title === '') {
            return false;
        }

        $lower = mb_strtolower($title, 'UTF-8');

        if (str_contains($lower, 'копия') || str_contains($lower, 'для жгу') || str_contains($lower, ' eng')) {
            return false;
        }

        if (preg_match('/[ӘәІіҢңҒғҮүҰұҚқӨөҺһ]/u', $title) === 1) {
            return false;
        }

        if (preg_match('/(?:^|\s)каз(?:\s|$)/u', $lower) === 1) {
            return false;
        }

        return str_contains($lower, 'сайт');
    }

    private function isMethodologyTitle(string $title): bool
    {
        return str_contains(mb_strtolower($title, 'UTF-8'), 'методолог');
    }

    private function extractYear(string $title): ?int
    {
        if (preg_match('/(20\d{2})/u', $title, $matches) !== 1) {
            return null;
        }

        return (int) $matches[1];
    }

    private function extractCategory(string $title): ?array
    {
        $lower = mb_strtolower($title, 'UTF-8');

        $map = [
            'многопрофиль' => ['key' => 'multidisciplinary', 'label' => 'Многопрофильные вузы'],
            'техническ' => ['key' => 'technical', 'label' => 'Технические вузы'],
            'гуманитарно-экономичес' => ['key' => 'humanitarian-economic', 'label' => 'Гуманитарно-экономические вузы'],
            'медицинск' => ['key' => 'medical', 'label' => 'Медицинские вузы'],
            'педагогичес' => ['key' => 'pedagogical', 'label' => 'Педагогические вузы'],
            'искусств' => ['key' => 'arts', 'label' => 'Вузы искусства'],
        ];

        foreach ($map as $needle => $category) {
            if (str_contains($lower, $needle)) {
                return $category;
            }
        }

        return null;
    }

    private function prepareHtml(string $html): string
    {
        $html = str_replace(['{source}', '{/source}'], '', $html);

        return trim($html);
    }

    private function parseRankingTable(string $html, string $title, int $year): array
    {
        $crawler = new Crawler($html);
        $table = $this->findPrimaryTable($crawler);

        if ($table === null) {
            return [
                'metricColumns' => [],
                'rows' => [],
                'topScore' => null,
            ];
        }

        $headers = $this->extractTableHeaders($table);
        $totalIndex = null;
        $metricColumns = [];

        foreach ($headers as $index => $header) {
            if ($index < 2) {
                continue;
            }

            if ($this->isTotalHeader($header)) {
                $totalIndex = $index;

                continue;
            }

            $key = $this->normalizeMetricKey($header) ?? "metric_{$index}";
            $metricColumns[$key] = [
                'key' => $key,
                'label' => $header,
            ];
        }

        $rows = [];
        $counter = 0;

        $table->filter('tr')->slice(1)->each(function (Crawler $row) use (&$rows, &$counter, $headers, $totalIndex, $metricColumns, $title, $year) {
            $cells = $row->filter('th,td');

            if ($cells->count() < 2) {
                return;
            }

            $placeText = $this->cleanText($cells->eq(0)->text());
            $nameCell = $cells->eq(1);
            $universityName = $this->cleanText($nameCell->text());

            if ($placeText === '' || $universityName === '') {
                return;
            }

            $place = $this->parsePlace($placeText);

            if ($place === null) {
                return;
            }

            $websiteUrl = null;

            if ($nameCell->filter('a')->count() > 0) {
                $websiteUrl = $nameCell->filter('a')->first()->attr('href');
            }

            $metrics = [];
            $totalScore = null;

            for ($index = 2; $index < $cells->count(); $index++) {
                $header = $headers[$index] ?? "Колонка {$index}";
                $value = $this->parseDecimal($this->cleanText($cells->eq($index)->text()));

                if ($totalIndex !== null && $index === $totalIndex) {
                    $totalScore = $value;

                    continue;
                }

                $metricKey = $this->normalizeMetricKey($header) ?? "metric_{$index}";
                $metrics[$metricKey] = $value;
            }

            $rows[] = [
                'id' => implode('-', [$year, $this->slugify($title), $place, $counter++]),
                'place' => $place,
                'universityName' => $universityName,
                'websiteUrl' => $websiteUrl,
                'totalScore' => $totalScore,
                'metrics' => $metrics,
            ];
        });

        usort($rows, function (array $left, array $right) {
            if (($left['place'] ?? 9999) !== ($right['place'] ?? 9999)) {
                return ($left['place'] ?? 9999) <=> ($right['place'] ?? 9999);
            }

            return ($left['universityName'] ?? '') <=> ($right['universityName'] ?? '');
        });

        $topScore = collect($rows)
            ->pluck('totalScore')
            ->filter(fn ($value) => $value !== null)
            ->max();

        return [
            'metricColumns' => array_values($metricColumns),
            'rows' => $rows,
            'topScore' => $topScore !== null ? (float) $topScore : null,
        ];
    }

    private function parseMethodologyTable(string $html, string $title, int $year): ?array
    {
        $crawler = new Crawler($html);
        $table = $this->findPrimaryTable($crawler);

        if ($table === null) {
            return null;
        }

        $headers = collect($this->extractTableHeaders($table))
            ->map(fn (string $header) => mb_strtolower($header, 'UTF-8'));

        $isMethodologyTable = $headers->contains(fn (string $header) => str_contains($header, 'критер'))
            && $headers->contains(fn (string $header) => str_contains($header, 'балл'));

        if (!$isMethodologyTable) {
            return null;
        }

        $criteria = [];

        $table->filter('tr')->slice(1)->each(function (Crawler $row) use (&$criteria) {
            $cells = $row->filter('th,td');

            if ($cells->count() < 3) {
                return;
            }

            $key = $this->cleanText($cells->eq(0)->text());
            $label = $this->cleanText($cells->eq(1)->text());
            $points = $this->parseDecimal($this->cleanText($cells->eq(2)->text()));

            if ($label === '') {
                return;
            }

            $criteria[] = [
                'key' => $key !== '' ? $key : null,
                'title' => $label,
                'points' => $points,
            ];
        });

        return [
            'title' => "Методология рейтинга веб-сайтов {$year}",
            'intro' => $this->extractIntroLines($html, $title),
            'criteria' => $criteria,
        ];
    }

    private function parseInlineMethodology(string $html, string $title, int $year): ?array
    {
        $introLines = $this->extractIntroLines($html, $title);

        if ($introLines === []) {
            return null;
        }

        $criteria = [];
        $plainIntro = [];

        foreach ($introLines as $line) {
            $criterion = $this->parseInlineCriterionLine($line);

            if ($criterion !== null) {
                $criteria[] = $criterion;

                continue;
            }

            $plainIntro[] = $line;
        }

        if ($criteria === []) {
            $joined = implode(' ', $introLines);
            $criteria = $this->extractInlineCriteriaFromJoinedText($joined);
            $plainIntro = array_values(array_filter(
                $plainIntro,
                fn (string $line) => preg_match('/\b[A-ZА-Я]\s*-/u', $line) !== 1
            ));
        }

        if ($criteria === [] && $plainIntro === []) {
            return null;
        }

        return [
            'title' => "Методология рейтинга веб-сайтов {$year}",
            'intro' => $plainIntro,
            'criteria' => $criteria,
        ];
    }

    private function extractIntroLines(string $html, string $title): array
    {
        $beforeTable = preg_split('/<table\b/i', $html, 2)[0] ?? $html;
        $crawler = new Crawler('<div>' . $beforeTable . '</div>');
        $lines = [];

        if ($crawler->filter('p')->count() > 0) {
            $crawler->filter('p')->each(function (Crawler $paragraph) use (&$lines, $title) {
                $text = $this->cleanText($paragraph->text());

                if ($text === '' || $text === $title) {
                    return;
                }

                $lines[] = $text;
            });
        } else {
            foreach (preg_split('/\R/u', strip_tags($beforeTable)) as $line) {
                $cleanLine = $this->cleanText($line);

                if ($cleanLine === '' || $cleanLine === $title) {
                    continue;
                }

                $lines[] = $cleanLine;
            }
        }

        return array_values(array_unique($lines));
    }

    private function parseInlineCriterionLine(string $line): ?array
    {
        if (preg_match('/^(?:\d+\)\s*)?([A-ZА-Я])\s*-\s*(.+?)(?:\((\d+(?:[.,]\d+)?)\s*балл[^)]*\))?$/u', $line, $matches) !== 1) {
            return null;
        }

        $points = isset($matches[3]) && $matches[3] !== ''
            ? $this->parseDecimal($matches[3])
            : null;

        return [
            'key' => mb_strtoupper($matches[1], 'UTF-8'),
            'title' => trim($matches[2]),
            'points' => $points,
        ];
    }

    private function extractInlineCriteriaFromJoinedText(string $text): array
    {
        $criteria = [];

        if (preg_match_all('/([A-ZА-Я])\s*-\s*(.+?)(?=(?:\s+[A-ZА-Я]\s*-\s)|$)/u', $text, $matches, PREG_SET_ORDER) === false) {
            return $criteria;
        }

        foreach ($matches as $match) {
            $description = trim($match[2]);
            $points = null;

            if (preg_match('/(.+?)\((\d+(?:[.,]\d+)?)\s*балл[^)]*\)/u', $description, $parts) === 1) {
                $description = trim($parts[1]);
                $points = $this->parseDecimal($parts[2]);
            }

            $criteria[] = [
                'key' => mb_strtoupper($match[1], 'UTF-8'),
                'title' => $description,
                'points' => $points,
            ];
        }

        return $criteria;
    }

    private function findPrimaryTable(Crawler $crawler): ?Crawler
    {
        $bestTable = null;
        $bestScore = -1;

        $crawler->filter('table')->each(function (Crawler $table) use (&$bestTable, &$bestScore) {
            $rowCount = $table->filter('tr')->count();
            $columnCount = $rowCount > 0 ? $table->filter('tr')->eq(0)->filter('th,td')->count() : 0;
            $score = ($rowCount * 100) + $columnCount;

            if ($rowCount > 1 && $score > $bestScore) {
                $bestScore = $score;
                $bestTable = $table;
            }
        });

        return $bestTable;
    }

    private function extractTableHeaders(Crawler $table): array
    {
        $headers = [];

        $table->filter('tr')->eq(0)->filter('th,td')->each(function (Crawler $cell) use (&$headers) {
            $headers[] = $this->cleanText($cell->text());
        });

        return $headers;
    }

    private function isTotalHeader(string $header): bool
    {
        $normalized = mb_strtolower($header, 'UTF-8');

        return in_array($normalized, ['итого', 'total'], true);
    }

    private function normalizeMetricKey(string $header): ?string
    {
        $header = trim($header);

        if (preg_match('/^[A-ZА-Я]$/u', $header) === 1) {
            return mb_strtoupper($header, 'UTF-8');
        }

        return null;
    }

    private function cleanText(string $value): string
    {
        $value = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $value = str_replace("\xc2\xa0", ' ', $value);
        $value = preg_replace('/\s+/u', ' ', $value);

        return trim((string) $value);
    }

    private function parsePlace(string $value): ?int
    {
        $digits = preg_replace('/[^\d]/u', '', $value);

        return $digits !== '' ? (int) $digits : null;
    }

    private function parseDecimal(?string $value): ?float
    {
        if ($value === null) {
            return null;
        }

        $normalized = str_replace([' ', "\xc2\xa0"], '', trim($value));
        $normalized = str_replace(',', '.', $normalized);
        $normalized = preg_replace('/[^0-9.\-]/', '', $normalized);

        return $normalized !== '' ? (float) $normalized : null;
    }

    private function slugify(string $value): string
    {
        $value = mb_strtolower($value, 'UTF-8');
        $value = preg_replace('/[^\p{L}\p{N}]+/u', '-', $value);

        return trim((string) $value, '-');
    }
}
