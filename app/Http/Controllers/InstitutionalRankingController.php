<?php

namespace App\Http\Controllers;

use App\Models\Ranking;
use App\Models\University;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class InstitutionalRankingController extends Controller
{
    public function index(Request $request): Response
    {
        $availableYears = $this->getAvailableYears();
        $selectedYear = $this->resolveSelectedYear($availableYears, $request->integer('year'));

        $ratings = $selectedYear
            ? $this->getInstitutionalRatingsForYear($selectedYear)
            : collect();

        $historyByUniversity = $this->getHistoryByUniversityIds(
            $ratings->pluck('university_id')->filter()->unique()->values()
        );

        $universityProfiles = $ratings
            ->map(fn (Ranking $rating) => $this->makeUniversityProfile(
                $rating,
                $historyByUniversity->get($rating->university_id, collect())
            ))
            ->values();

        return Inertia::render('iqaa_ranking', [
            'ratingYear' => $selectedYear,
            'availableYears' => $availableYears->all(),
            'ratings' => $ratings,
            'universityProfiles' => $universityProfiles->all(),
        ]);
    }

    public function show(Request $request, University $university): Response
    {
        $universityRatings = Ranking::query()
            ->with('university')
            ->where('level_type', 'institutional')
            ->where('university_id', $university->id)
            ->orderBy('year')
            ->orderBy('rank')
            ->get();

        abort_if($universityRatings->isEmpty(), 404);

        $history = $this->makeHistory($universityRatings);
        $availableYears = $history
            ->pluck('year')
            ->map(fn ($year) => (int) $year)
            ->sortDesc()
            ->values();

        $selectedYear = $this->resolveSelectedYear($availableYears, $request->integer('year'));

        /** @var Ranking|null $currentRating */
        $currentRating = $universityRatings
            ->filter(fn (Ranking $rating) => (int) $rating->year === $selectedYear)
            ->sortBy('rank')
            ->first();

        if (! $currentRating) {
            $fallbackYear = $availableYears->first();

            $currentRating = $universityRatings
                ->filter(fn (Ranking $rating) => (int) $rating->year === $fallbackYear)
                ->sortBy('rank')
                ->first() ?? $universityRatings->sortBy('rank')->first();
        }

        $profile = $this->makeUniversityProfile($currentRating, $history);
        $peerRatings = $this->getPeerRatings($currentRating, $university->id);

        return Inertia::render('university_profile', [
            'profile' => $profile,
            'selectedYear' => $selectedYear,
            'availableYears' => $availableYears->all(),
            'peerRatings' => $peerRatings->all(),
            'backHref' => $selectedYear ? "/ranking?year={$selectedYear}" : '/ranking',
        ]);
    }

    public function variantTwo(Request $request): Response
    {
        $availableYears = $this->getAvailableYears();
        $selectedYear = $this->resolveSelectedYear($availableYears, $request->integer('year'));

        $ratings = $selectedYear
            ? $this->getInstitutionalRatingsForYear($selectedYear)
            : collect();

        $historyByUniversity = $this->getHistoryByUniversityIds(
            $ratings->pluck('university_id')->filter()->unique()->values()
        );

        $categories = $this->makeInstitutionalVariantTwoCategories(
            $ratings,
            $historyByUniversity,
            (int) $selectedYear,
            $availableYears->count()
        );

        return Inertia::render('institutional_ranking_v2', [
            'selectedYear' => $selectedYear,
            'availableYears' => $availableYears->all(),
            'categories' => $categories->all(),
            'totalUniversities' => $ratings->count(),
            'indicatorCount' => 6,
        ]);
    }

    public function showVariantTwo(Request $request, University $university): Response
    {
        $availableYears = $this->getAvailableYears();

        $universityRatings = Ranking::query()
            ->with('university')
            ->where('level_type', 'institutional')
            ->where('university_id', $university->id)
            ->orderBy('year')
            ->orderBy('rank')
            ->get();

        abort_if($universityRatings->isEmpty(), 404);

        $history = $this->makeHistory($universityRatings);
        $selectedYear = $this->resolveSelectedYear($availableYears, $request->integer('year'));

        /** @var Ranking|null $currentRating */
        $currentRating = $universityRatings
            ->filter(fn (Ranking $rating) => (int) $rating->year === $selectedYear)
            ->sortBy('rank')
            ->first();

        if (! $currentRating) {
            $fallbackYear = $availableYears->first();

            $currentRating = $universityRatings
                ->filter(fn (Ranking $rating) => (int) $rating->year === $fallbackYear)
                ->sortBy('rank')
                ->first() ?? $universityRatings->sortBy('rank')->first();
        }

        abort_if(! $currentRating, 404);

        $categoryRatings = Ranking::query()
            ->with('university')
            ->where('level_type', 'institutional')
            ->where('year', $currentRating->year)
            ->where('institutional_category', $currentRating->institutional_category)
            ->orderBy('rank')
            ->get();

        $categoryHistoryByUniversity = $this->getHistoryByUniversityIds(
            $categoryRatings->pluck('university_id')->filter()->unique()->values()
        );

        $categoryMeta = $this->getCategoryMeta($currentRating->institutional_category);
        $categoryUniversities = $categoryRatings
            ->map(fn (Ranking $rating) => $this->makeInstitutionalVariantTwoUniversity(
                $rating,
                $categoryHistoryByUniversity->get($rating->university_id, collect()),
                $categoryRatings->count(),
                $availableYears->count(),
                (int) $currentRating->year
            ))
            ->values();

        $currentUniversity = $categoryUniversities
            ->firstWhere('id', $university->id)
            ?? $this->makeInstitutionalVariantTwoUniversity(
                $currentRating,
                $history,
                $categoryRatings->count(),
                $availableYears->count(),
                (int) $currentRating->year
            );

        return Inertia::render('institutional_analysis_v2', [
            'selectedYear' => (int) $currentRating->year,
            'availableYears' => $availableYears->all(),
            'university' => $currentUniversity,
            'history' => $history->all(),
            'category' => [
                'id' => $categoryMeta['id'],
                'name' => $currentRating->institutional_category,
                'icon' => $categoryMeta['icon'],
                'averageScore' => round((float) $categoryRatings->avg('total_score'), 2),
                'universities' => $categoryUniversities->all(),
            ],
            'backHref' => "/ranking-v2?year={$currentRating->year}",
        ]);
    }

    protected function getAvailableYears(): Collection
    {
        return Ranking::query()
            ->where('level_type', 'institutional')
            ->whereNotNull('year')
            ->distinct()
            ->orderByDesc('year')
            ->pluck('year')
            ->map(fn ($year) => (int) $year)
            ->values();
    }

    protected function resolveSelectedYear(Collection $availableYears, ?int $requestedYear): ?int
    {
        if ($requestedYear && $availableYears->contains($requestedYear)) {
            return $requestedYear;
        }

        return $availableYears->first();
    }

    protected function getInstitutionalRatingsForYear(int $year): Collection
    {
        return Ranking::query()
            ->with('university')
            ->where('level_type', 'institutional')
            ->where('year', $year)
            ->orderBy('rank')
            ->get();
    }

    protected function getHistoryByUniversityIds(Collection $universityIds): Collection
    {
        if ($universityIds->isEmpty()) {
            return collect();
        }

        return Ranking::query()
            ->where('level_type', 'institutional')
            ->whereIn('university_id', $universityIds)
            ->orderBy('year')
            ->get(['university_id', 'year', 'rank', 'total_score'])
            ->groupBy('university_id')
            ->map(fn (Collection $items) => $this->makeHistory($items));
    }

    protected function makeHistory(Collection $items): Collection
    {
        return $items
            ->groupBy('year')
            ->map(function (Collection $yearItems) {
                /** @var Ranking $entry */
                $entry = $yearItems->sortBy('rank')->first();

                return [
                    'year' => (int) $entry->year,
                    'rank' => (int) $entry->rank,
                    'totalScore' => (float) $entry->total_score,
                ];
            })
            ->sortBy('year')
            ->values();
    }

    protected function makeUniversityProfile(Ranking $rating, Collection $history): array
    {
        $university = $rating->university;

        return [
            'id' => $university?->id,
            'currentName' => $university?->current_name,
            'city' => $university?->city,
            'status' => $university?->status,
            'currentRank' => (int) $rating->rank,
            'currentScore' => (float) $rating->total_score,
            'institutionalCategory' => $rating->institutional_category,
            'website' => null,
            'rector' => null,
            'address' => null,
            'foundedYear' => null,
            'studentCount' => null,
            'history' => $history->values()->all(),
        ];
    }

    protected function getPeerRatings(Ranking $currentRating, int $currentUniversityId): Collection
    {
        return Ranking::query()
            ->with('university')
            ->where('level_type', 'institutional')
            ->where('year', $currentRating->year)
            ->where('institutional_category', $currentRating->institutional_category)
            ->orderBy('rank')
            ->limit(12)
            ->get()
            ->map(function (Ranking $rating) use ($currentUniversityId) {
                return [
                    'id' => $rating->id,
                    'rank' => (int) $rating->rank,
                    'totalScore' => (float) $rating->total_score,
                    'universityId' => $rating->university?->id,
                    'universityName' => $rating->university?->current_name,
                    'isCurrent' => (int) $rating->university_id === $currentUniversityId,
                ];
            })
            ->values();
    }

    protected function makeInstitutionalVariantTwoCategories(
        Collection $ratings,
        Collection $historyByUniversity,
        int $selectedYear,
        int $availableYearCount
    ): Collection {
        return $ratings
            ->groupBy('institutional_category')
            ->map(function (Collection $categoryRatings, string $categoryName) use (
                $historyByUniversity,
                $selectedYear,
                $availableYearCount
            ) {
                $meta = $this->getCategoryMeta($categoryName);

                $universities = $categoryRatings
                    ->sortBy('rank')
                    ->values()
                    ->map(fn (Ranking $rating) => $this->makeInstitutionalVariantTwoUniversity(
                        $rating,
                        $historyByUniversity->get($rating->university_id, collect()),
                        $categoryRatings->count(),
                        $availableYearCount,
                        $selectedYear
                    ));

                return [
                    'id' => $meta['id'],
                    'name' => $categoryName,
                    'icon' => $meta['icon'],
                    'order' => $meta['order'],
                    'universities' => $universities->all(),
                ];
            })
            ->sortBy('order')
            ->values();
    }

    protected function makeInstitutionalVariantTwoUniversity(
        Ranking $rating,
        Collection $history,
        int $categoryCount,
        int $availableYearCount,
        int $selectedYear
    ): array {
        $metrics = $this->makeInstitutionalVariantTwoMetrics(
            $rating,
            $history,
            $categoryCount,
            $availableYearCount
        );

        return [
            'id' => $rating->university?->id,
            'name' => $rating->university?->current_name ?? 'Университет не указан',
            'city' => $rating->university?->city ?? 'Город не указан',
            'place' => (int) $rating->rank,
            'score' => round((float) $rating->total_score, 2),
            'metrics' => $metrics,
            'analysisHref' => $rating->university_id
                ? "/ranking-v2/university/{$rating->university_id}?year={$selectedYear}"
                : null,
        ];
    }

    protected function makeInstitutionalVariantTwoMetrics(
        Ranking $rating,
        Collection $history,
        int $categoryCount,
        int $availableYearCount
    ): array {
        $score = round((float) $rating->total_score, 2);
        $bestRank = $history->isNotEmpty() ? (int) $history->min('rank') : (int) $rating->rank;
        $stabilityScore = $this->calculateStabilityScore($history);
        $momentum = $this->calculateMomentum($history);
        $archiveYears = $history->count();

        return [
            [
                'key' => 'overall',
                'title' => 'Итоговый балл',
                'shortLabel' => 'Балл',
                'score' => $score,
                'rawValue' => $score,
                'valueLabel' => number_format($score, 2, '.', ''),
                'comparisonDirection' => 'higher',
            ],
            [
                'key' => 'position',
                'title' => 'Позиция в категории',
                'shortLabel' => 'Ранг',
                'score' => $this->normalizeRankScore((int) $rating->rank, $categoryCount),
                'rawValue' => (float) $rating->rank,
                'valueLabel' => '#'.(int) $rating->rank,
                'comparisonDirection' => 'lower',
            ],
            [
                'key' => 'best_rank',
                'title' => 'Лучшая историческая позиция',
                'shortLabel' => 'Пик',
                'score' => $this->normalizeRankScore($bestRank, $categoryCount),
                'rawValue' => (float) $bestRank,
                'valueLabel' => '#'.$bestRank,
                'comparisonDirection' => 'lower',
            ],
            [
                'key' => 'stability',
                'title' => 'Стабильность по годам',
                'shortLabel' => 'Стаб.',
                'score' => $stabilityScore,
                'rawValue' => $stabilityScore,
                'valueLabel' => round($stabilityScore).'%',
                'comparisonDirection' => 'higher',
            ],
            [
                'key' => 'momentum',
                'title' => 'Динамика балла',
                'shortLabel' => 'Тренд',
                'score' => $momentum === null
                    ? 50.0
                    : max(0, min(100, round(50 + ($momentum * 5), 2))),
                'rawValue' => $momentum,
                'valueLabel' => $momentum === null ? 'н/д' : sprintf('%+.2f', $momentum),
                'comparisonDirection' => 'higher',
            ],
            [
                'key' => 'coverage',
                'title' => 'Покрытие архива',
                'shortLabel' => 'Архив',
                'score' => $availableYearCount > 0
                    ? round(($archiveYears / $availableYearCount) * 100, 2)
                    : 0,
                'rawValue' => (float) $archiveYears,
                'valueLabel' => $archiveYears.' г.',
                'comparisonDirection' => 'higher',
            ],
        ];
    }

    protected function normalizeRankScore(int $rank, int $categoryCount): float
    {
        if ($categoryCount <= 1) {
            return 100;
        }

        $normalized = 1 - (($rank - 1) / max(1, $categoryCount - 1));

        return round(max(0, min(1, $normalized)) * 100, 2);
    }

    protected function calculateStabilityScore(Collection $history): float
    {
        $sortedHistory = $history->sortBy('year')->values();

        if ($sortedHistory->count() < 2) {
            return 50;
        }

        $deltas = [];

        for ($index = 1; $index < $sortedHistory->count(); $index++) {
            $deltas[] = abs(
                (int) $sortedHistory[$index]['rank'] - (int) $sortedHistory[$index - 1]['rank']
            );
        }

        $averageDelta = collect($deltas)->avg() ?? 0;
        $maxRank = max(3, (int) $sortedHistory->max('rank'));
        $normalized = min(1, $averageDelta / max(1, $maxRank - 1));

        return round((1 - $normalized) * 100, 2);
    }

    protected function calculateMomentum(Collection $history): ?float
    {
        $sortedHistory = $history->sortBy('year')->values();

        if ($sortedHistory->count() < 2) {
            return null;
        }

        $current = $sortedHistory[$sortedHistory->count() - 1];
        $previous = $sortedHistory[$sortedHistory->count() - 2];

        return round((float) $current['totalScore'] - (float) $previous['totalScore'], 2);
    }

    protected function getCategoryMeta(string $categoryName): array
    {
        return match ($categoryName) {
            'Многопрофильные вузы' => ['id' => 'multi', 'icon' => '🏛️', 'order' => 1],
            'Технические вузы' => ['id' => 'technical', 'icon' => '⚙️', 'order' => 2],
            'Гуманитарно-экономические вузы' => ['id' => 'humanitarian', 'icon' => '📚', 'order' => 3],
            'Педагогические вузы' => ['id' => 'pedagogical', 'icon' => '🎓', 'order' => 4],
            'Медицинские вузы' => ['id' => 'medical', 'icon' => '🩺', 'order' => 5],
            'Вузы искусства и спорта' => ['id' => 'art', 'icon' => '🎭', 'order' => 6],
            default => ['id' => 'category-'.md5($categoryName), 'icon' => '🏫', 'order' => 99],
        };
    }
}
