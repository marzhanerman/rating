<?php

namespace App\Http\Controllers;

use App\Models\University;
use App\Models\InstitutionalRating;
use App\Models\Ranking;
use Inertia\Inertia;
use App\Services\InstitutionalRankingImportService;
class HomeController extends Controller
{
    public function index()
    {
       /* $universities = University::with('institutionalRatings')
        ->whereHas('institutionalRatings')
        ->get()
        ->sortBy('institutionalRatings.0.total_score', SORT_REGULAR, true)
        ->take(5)
        ->values();*/
        $ratings = Ranking::with('university')
        ->where('year', 2025)
        ->orderBy('rank')
        //->limit(5)
        ->get();
        return Inertia::render('RankingHome', [
            //'universities' => $universities,
            'ratings' => $ratings,
        ]);
    }

    public function import(Request $request, InstitutionalRankingImportService $service)
    {
        $file = $request->file('file');

        $path = $file->store('imports');

        $service->import(storage_path('app/' . $path));

        return back()->with('success', 'Импорт завершен');
    }
}