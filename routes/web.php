<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Models\University;
use App\Models\Ranking;
use App\Http\Controllers\InstitutionalImportController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProgramRankingController;
use App\Http\Controllers\WebsiteRankingController;

Route::get('/', [HomeController::class, 'index']);

/*Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');*/

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/ranking', function () {
    $latestYear = Ranking::query()
        ->where('level_type', 'institutional')
        ->max('year');

    $ratings = $latestYear
        ? Ranking::with('university')
            ->where('level_type', 'institutional')
            ->where('year', $latestYear)
            ->orderBy('rank')
            ->get()
        : collect();

    $historyByUniversity = $ratings->isNotEmpty()
        ? Ranking::query()
            ->where('level_type', 'institutional')
            ->whereIn('university_id', $ratings->pluck('university_id')->filter()->unique())
            ->orderBy('year')
            ->get(['university_id', 'year', 'rank', 'total_score'])
            ->groupBy('university_id')
            ->map(function ($items) {
                return $items
                    ->groupBy('year')
                    ->map(function ($yearItems) {
                        $entry = $yearItems->sortBy('rank')->first();

                        return [
                            'year' => (int) $entry->year,
                            'rank' => (int) $entry->rank,
                            'totalScore' => (float) $entry->total_score,
                        ];
                    })
                    ->values();
            })
        : collect();

    $universityProfiles = $ratings->map(function ($rating) use ($historyByUniversity) {
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
            'history' => $historyByUniversity->get($rating->university_id, []),
        ];
    })->values();

    return Inertia::render('iqaa_ranking', [
        'ratingYear' => $latestYear,
        'ratings' => $ratings,
        'universityProfiles' => $universityProfiles,
    ]);
});
Route::get('/program-ranking', [ProgramRankingController::class, 'index']);
Route::get('/website-ranking', [WebsiteRankingController::class, 'index']);
Route::get('/methodology', function () {
    return Inertia::render('methodology');
});
Route::get('/ireg', function () {
    return Inertia::render('ireg');
});
Route::get('/ireg-2', function () {
    return Inertia::render('versions/ireg-before-archive-visuals-2026-03-30');
});
Route::get('/import-institutional', function () {
    return Inertia::render('admin/ImportInstitutional');
});

Route::post('/import-institutional', [InstitutionalImportController::class, 'import']);
/*Route::get('/home', function () {
    return Inertia::render('ranking_home');
});*/


Route::get('/universities', function () {
    return University::all();
});
/*Route::get('/home', function () {
    return Inertia::render('home');
});
->middleware(['auth', 'verified'])->name('home');*/
Route::get('/test', function () {
    return \App\Models\University::with('institutionalRatings')->get();
});

require __DIR__.'/settings.php';
