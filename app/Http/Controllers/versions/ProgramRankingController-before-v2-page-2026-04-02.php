<?php

namespace App\Http\Controllers;

use App\Models\Ranking2;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProgramRankingController extends Controller
{
    public function index(Request $request): Response
    {
        $yearOptions = Ranking2::query()
            ->selectRaw('year, level_type, count(*) as entry_count, count(distinct level_id) as level_count, count(distinct university_id) as university_count, sum(case when total_score is null then 0 else 1 end) as scored_count')
            ->groupBy('year', 'level_type')
            ->orderByDesc('year')
            ->get()
            ->map(fn (Ranking2 $summary) => [
                'year' => (int) $summary->year,
                'levelType' => $summary->level_type,
                'entryCount' => (int) $summary->entry_count,
                'levelCount' => (int) $summary->level_count,
                'universityCount' => (int) $summary->university_count,
                'scoredCount' => (int) $summary->scored_count,
                'hasScores' => (int) $summary->scored_count > 0,
                'label' => $summary->level_type === 'program'
                    ? 'Образовательные программы'
                    : 'Группы образовательных программ',
                'shortLabel' => $summary->level_type === 'program'
                    ? 'Программы'
                    : 'Группы ОП',
            ])
            ->values();

        $selectedYear = (int) $request->integer('year');
        $availableYears = $yearOptions->pluck('year')->all();

        if (!$selectedYear || !in_array($selectedYear, $availableYears, true)) {
            $selectedYear = (int) ($yearOptions->first()['year'] ?? now()->year);
        }

        $selectedMeta = $yearOptions->firstWhere('year', $selectedYear);

        $ratings = Ranking2::query()
            ->with([
                'university:id,current_name,city',
                'groupLevel:id,code,name,direction_id,year',
                'groupLevel.direction:id,code,name,field_id,year',
                'groupLevel.direction.field:id,code,name,degree,type',
                'educationalProgramLevel:id,code,name,field_id,group_id',
                'educationalProgramLevel.field:id,code,name,degree,type',
            ])
            ->where('year', $selectedYear)
            ->orderBy('level_id')
            ->orderBy('rank')
            ->get()
            ->map(function (Ranking2 $rating) {
                $level = $rating->level_type === 'program'
                    ? $rating->educationalProgramLevel
                    : $rating->groupLevel;

                $field = $rating->level_type === 'program'
                    ? $rating->educationalProgramLevel?->field
                    : $rating->groupLevel?->direction?->field;

                $direction = $rating->level_type === 'group'
                    ? $rating->groupLevel?->direction
                    : null;

                $programs = collect($rating->programs ?? [])
                    ->map(fn (array $program) => [
                        'code' => $program['code'] ?? null,
                        'name' => $program['name'] ?? null,
                    ])
                    ->filter(fn (array $program) => $program['code'] || $program['name'])
                    ->values()
                    ->all();

                $degreeValue = $field?->degree ?? $this->normalizeDegreeFromCode($level?->code);
                $degreeLabel = $this->degreeLabel($degreeValue);

                return [
                    'id' => $rating->id,
                    'rank' => (int) $rating->rank,
                    'totalScore' => $rating->total_score !== null ? (float) $rating->total_score : null,
                    'levelType' => $rating->level_type,
                    'degree' => [
                        'value' => $degreeValue,
                        'label' => $degreeLabel,
                        'shortLabel' => $this->degreeShortLabel($degreeValue),
                    ],
                    'field' => [
                        'id' => $field?->id,
                        'code' => $field?->code,
                        'name' => $field?->name ?? 'Без направления',
                        'label' => $this->formatFieldLabel($field?->code, $field?->name),
                    ],
                    'direction' => $direction ? [
                        'id' => $direction->id,
                        'code' => $direction->code,
                        'name' => $direction->name,
                    ] : null,
                    'university' => $rating->university ? [
                        'id' => $rating->university->id,
                        'currentName' => $rating->university->current_name,
                        'city' => $rating->university->city,
                    ] : null,
                    'level' => [
                        'id' => $rating->level_id,
                        'code' => $level?->code,
                        'name' => $level?->name,
                        'label' => $this->formatLevelLabel($level?->code, $level?->name, $rating->level_id),
                    ],
                    'programs' => $programs,
                ];
            })
            ->values();

        return Inertia::render('program_ranking', [
            'selectedYear' => $selectedYear,
            'selectedMeta' => $selectedMeta,
            'yearOptions' => $yearOptions,
            'ratings' => $ratings,
        ]);
    }

    private function formatLevelLabel(?string $code, ?string $name, int $fallbackId): string
    {
        $parts = array_values(array_filter([$code, $name]));

        if ($parts !== []) {
            return implode(' — ', $parts);
        }

        return "Позиция {$fallbackId}";
    }

    private function formatFieldLabel(?string $code, ?string $name): string
    {
        $parts = array_values(array_filter([$code, $name]));

        if ($parts !== []) {
            return implode(' — ', $parts);
        }

        return $name ?: 'Без направления';
    }

    private function normalizeDegreeFromCode(?string $code): ?string
    {
        $normalized = mb_strtolower((string) $code);

        if (str_starts_with($normalized, '6b') || str_starts_with($normalized, '5b')) {
            return 'bachelor';
        }

        if (str_starts_with($normalized, '7m')) {
            return 'master';
        }

        if (str_starts_with($normalized, '8d')) {
            return 'phd';
        }

        return null;
    }

    private function degreeLabel(?string $degree): string
    {
        return match ($degree) {
            'bachelor' => 'Бакалавриат',
            'master' => 'Магистратура',
            'phd' => 'Докторантура',
            default => 'Уровень не указан',
        };
    }

    private function degreeShortLabel(?string $degree): string
    {
        return match ($degree) {
            'bachelor' => 'Бакалавриат',
            'master' => 'Магистратура',
            'phd' => 'PhD',
            default => 'Не указан',
        };
    }
}
