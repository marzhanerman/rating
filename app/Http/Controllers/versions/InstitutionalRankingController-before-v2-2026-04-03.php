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
}
