<?php

namespace App\Http\Controllers;

use App\Models\WebsiteRanking;
use App\Models\WebsiteRankingMethodology;
use App\Models\WebsiteRankingYear;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class WebsiteRankingController extends Controller
{
    public function index(Request $request): Response
    {
        $archive = $this->buildArchive();

        $yearOptions = $archive
            ->map(fn (array $yearData) => [
                'year' => $yearData['year'],
                'entryCount' => $yearData['entryCount'],
                'categoryCount' => $yearData['categoryCount'],
                'metricCount' => $yearData['metricCount'],
                'hasMethodology' => $yearData['methodology'] !== null,
                'hasDetailedMetrics' => $yearData['metricCount'] > 0,
                'topScore' => $yearData['topScore'],
                'modeLabel' => $yearData['categoryCount'] > 1
                    ? 'Профильные категории'
                    : 'Единый список',
            ])
            ->values();

        $selectedYear = (int) $request->integer('year');
        $availableYears = $yearOptions->pluck('year')->all();

        if (! $selectedYear || ! in_array($selectedYear, $availableYears, true)) {
            $selectedYear = (int) ($yearOptions->first()['year'] ?? now()->year);
        }

        $selectedRating = $archive->firstWhere('year', $selectedYear);

        return Inertia::render('website_ranking', [
            'selectedYear' => $selectedYear,
            'selectedRating' => $selectedRating,
            'yearOptions' => $yearOptions,
        ]);
    }

    private function buildArchive(): Collection
    {
        $rankingYears = WebsiteRankingYear::query()
            ->orderByDesc('year')
            ->get()
            ->keyBy('year');

        $rankings = WebsiteRanking::query()
            ->orderByDesc('year')
            ->orderBy('category_key')
            ->orderBy('place')
            ->get();

        $methodologies = WebsiteRankingMethodology::query()
            ->orderByDesc('year')
            ->get()
            ->keyBy('year');

        $years = $rankingYears->keys()
            ->merge($rankings->pluck('year'))
            ->merge($methodologies->keys())
            ->filter()
            ->map(fn ($year) => (int) $year)
            ->unique()
            ->sortDesc()
            ->values();

        return $years->map(function (int $year) use ($rankingYears, $rankings, $methodologies) {
            /** @var WebsiteRankingYear|null $yearMeta */
            $yearMeta = $rankingYears->get($year);
            /** @var WebsiteRankingMethodology|null $methodology */
            $methodology = $methodologies->get($year);

            $yearRows = $rankings
                ->where('year', $year)
                ->sortBy([
                    ['category_key', 'asc'],
                    ['place', 'asc'],
                ])
                ->values();

            $metricColumns = $this->resolveMetricColumns(
                $yearMeta?->metric_columns ?? [],
                $yearRows,
                $methodology,
            );

            $categories = $yearRows
                ->groupBy(fn (WebsiteRanking $row) => $row->category_key ?: 'all')
                ->map(function (Collection $categoryRows, string $categoryKey) {
                    /** @var WebsiteRanking $firstRow */
                    $firstRow = $categoryRows->first();
                    $topScore = $categoryRows->max('total_score');

                    return [
                        'key' => $categoryKey,
                        'label' => $firstRow->category_label ?: 'Общий рейтинг',
                        'entryCount' => $categoryRows->count(),
                        'topScore' => $topScore !== null ? (float) $topScore : null,
                        'rows' => $categoryRows
                            ->sortBy('place')
                            ->values()
                            ->map(fn (WebsiteRanking $row) => [
                                'id' => (string) $row->id,
                                'place' => (int) $row->place,
                                'universityName' => $row->university_name,
                                'websiteUrl' => $row->website_url,
                                'totalScore' => $row->total_score !== null
                                    ? (float) $row->total_score
                                    : null,
                                'metrics' => collect($row->metrics ?? [])
                                    ->map(fn ($value) => $value !== null ? (float) $value : null)
                                    ->all(),
                            ])
                            ->all(),
                    ];
                })
                ->sortBy(fn (array $category) => $category['rows'][0]['place'] ?? 9999)
                ->values()
                ->all();

            $topScore = $yearRows->max('total_score');

            return [
                'year' => $year,
                'title' => $yearMeta?->title ?? "Рейтинг веб-сайтов вузов Казахстана - {$year}",
                'entryCount' => $yearRows->count(),
                'categoryCount' => count($categories),
                'metricCount' => count($metricColumns),
                'topScore' => $topScore !== null ? (float) $topScore : null,
                'metricColumns' => $metricColumns,
                'categories' => $categories,
                'methodology' => $methodology ? [
                    'title' => $methodology->title,
                    'intro' => $methodology->intro ?? [],
                    'criteria' => collect($methodology->criteria ?? [])
                        ->map(fn (array $criterion) => [
                            'key' => $criterion['key'] ?? null,
                            'title' => $criterion['title'] ?? null,
                            'points' => isset($criterion['points']) && $criterion['points'] !== null
                                ? (float) $criterion['points']
                                : null,
                        ])
                        ->filter(fn (array $criterion) => ! empty($criterion['title']))
                        ->values()
                        ->all(),
                ] : null,
            ];
        })->values();
    }

    private function resolveMetricColumns(
        array $storedMetricColumns,
        Collection $yearRows,
        ?WebsiteRankingMethodology $methodology,
    ): array {
        $columns = collect($storedMetricColumns)
            ->filter(fn ($column) => is_array($column) && ! empty($column['key']))
            ->map(fn (array $column) => [
                'key' => (string) $column['key'],
                'label' => (string) ($column['label'] ?? $column['key']),
            ]);

        if ($columns->isNotEmpty()) {
            return $columns->values()->all();
        }

        $criteriaOrder = collect($methodology?->criteria ?? [])
            ->pluck('key')
            ->filter()
            ->map(fn ($key) => (string) $key)
            ->values()
            ->all();

        $orderMap = array_flip($criteriaOrder);

        return $yearRows
            ->flatMap(fn (WebsiteRanking $row) => array_keys($row->metrics ?? []))
            ->filter()
            ->unique()
            ->sortBy(fn (string $key) => $orderMap[$key] ?? 9999)
            ->values()
            ->map(fn (string $key) => [
                'key' => $key,
                'label' => $key,
            ])
            ->all();
    }
}
