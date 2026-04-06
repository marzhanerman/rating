<?php

namespace App\Http\Controllers;

use App\Models\PublicationRanking;
use App\Models\PublicationRankingMethodology;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class PublicationRankingController extends Controller
{
    public function index(Request $request): Response
    {
        $archive = $this->buildArchive();
        $yearOptions = $archive
            ->map(fn (array $yearData) => [
                'year' => $yearData['year'],
                'entryCount' => $yearData['entryCount'],
                'categoryCount' => $yearData['categoryCount'],
                'topScore' => $yearData['topScore'],
                'hasMethodology' => $yearData['methodology'] !== null,
                'criteriaCount' => count($yearData['methodology']['criteria'] ?? []),
            ])
            ->values();

        $selectedYear = (int) $request->integer('year');
        $availableYears = $yearOptions->pluck('year')->all();

        if (! $selectedYear || ! in_array($selectedYear, $availableYears, true)) {
            $selectedYear = (int) ($yearOptions->first()['year'] ?? now()->year);
        }

        $selectedRating = $archive->firstWhere('year', $selectedYear);

        return Inertia::render('publication_ranking', [
            'selectedYear' => $selectedYear,
            'selectedRating' => $selectedRating,
            'yearOptions' => $yearOptions,
        ]);
    }

    private function buildArchive(): Collection
    {
        $ratings = PublicationRanking::query()
            ->with('universityModel:id,current_name,city')
            ->orderByDesc('year')
            ->orderBy('category')
            ->orderBy('place')
            ->get();

        $methodologies = PublicationRankingMethodology::query()
            ->orderByDesc('year')
            ->get()
            ->keyBy('year');

        $years = $ratings->pluck('year')
            ->merge($methodologies->keys())
            ->filter()
            ->map(fn ($year) => (int) $year)
            ->unique()
            ->sortDesc()
            ->values();

        return $years->map(function (int $year) use ($ratings, $methodologies) {
            $yearRows = $ratings
                ->where('year', $year)
                ->sortBy([
                    ['category', 'asc'],
                    ['place', 'asc'],
                ])
                ->values();

            $categories = $yearRows
                ->groupBy(fn (PublicationRanking $row) => $row->category ?: '__overall__')
                ->map(function (Collection $categoryRows, string $categoryKey) {
                    /** @var PublicationRanking $firstRow */
                    $firstRow = $categoryRows->first();
                    $label = $firstRow->category ?: 'Общий рейтинг вузов';
                    $topScore = $categoryRows->max('total');

                    return [
                        'key' => $categoryKey,
                        'label' => $label,
                        'themeKey' => $this->resolveThemeKey($label),
                        'entryCount' => $categoryRows->count(),
                        'topScore' => $topScore !== null ? (float) $topScore : null,
                        'rows' => $categoryRows
                            ->sortBy('place')
                            ->values()
                            ->map(fn (PublicationRanking $row) => [
                                'id' => $row->id,
                                'place' => (int) $row->place,
                                'universityName' => $row->universityModel?->current_name ?: $row->university,
                                'city' => $row->universityModel?->city,
                                'universityId' => $row->university_id,
                                'total' => $row->total !== null ? (float) $row->total : null,
                            ])
                            ->all(),
                    ];
                })
                ->values()
                ->all();

            /** @var PublicationRankingMethodology|null $methodology */
            $methodology = $methodologies->get($year);

            return [
                'year' => $year,
                'title' => "Рейтинг вузов по научным публикациям {$year}",
                'entryCount' => $yearRows->count(),
                'categoryCount' => count($categories),
                'topScore' => $yearRows->max('total') !== null ? (float) $yearRows->max('total') : null,
                'categories' => $categories,
                'methodology' => $methodology ? [
                    'title' => $methodology->title,
                    'criteria' => collect($methodology->criteria ?? [])
                        ->map(fn (array $criterion) => [
                            'number' => $criterion['number'] ?? null,
                            'title' => $criterion['criterion'] ?? $criterion['title'] ?? null,
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

    private function resolveThemeKey(?string $label): string
    {
        if (! $label) {
            return 'overall';
        }

        $normalized = mb_strtolower($label, 'UTF-8');

        return match (true) {
            str_contains($normalized, 'многопроф') => 'multi',
            str_contains($normalized, 'техничес') => 'technical',
            str_contains($normalized, 'гуманитар') || str_contains($normalized, 'эконом') => 'humanitarian',
            str_contains($normalized, 'педагог') => 'pedagogical',
            str_contains($normalized, 'медицин') => 'medical',
            str_contains($normalized, 'искус') || str_contains($normalized, 'спорт') => 'creative',
            default => 'overall',
        };
    }
}
