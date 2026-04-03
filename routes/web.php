<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Models\University;
use App\Http\Controllers\InstitutionalImportController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InstitutionalRankingController;
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
Route::get('/test1', function () {
    return Inertia::render('test/iqaa_ranking_mockup_react-2');
});
Route::get('/test2', function () {
    return Inertia::render('test/iqaa_university_profile_page');
});
Route::get('/test-university-card', function () {
    return Inertia::render('test/university-card');
});
Route::get('/test-ranking', function () {
    return Inertia::render('test/university_ranking_presentation_template');
});
Route::get('/ranking', [InstitutionalRankingController::class, 'index']);
Route::get('/ranking/university/{university}', [InstitutionalRankingController::class, 'show']);
Route::get('/ranking-v2', [InstitutionalRankingController::class, 'variantTwo']);
Route::get('/ranking-v2/university/{university}', [InstitutionalRankingController::class, 'showVariantTwo']);
Route::get('/program-ranking', [ProgramRankingController::class, 'index']);
Route::get('/program-ranking-v2', [ProgramRankingController::class, 'variantTwo']);
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
