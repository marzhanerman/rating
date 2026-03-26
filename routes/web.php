<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Models\University;
use App\Http\Controllers\InstitutionalImportController;
use App\Http\Controllers\HomeController;

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
    return Inertia::render('iqaa_ranking');
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
