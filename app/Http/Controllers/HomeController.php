<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
        $latestYear = Ranking::query()->max('year');

        $ratings = $latestYear
            ? Ranking::with('university')
                ->where('year', $latestYear)
                ->orderBy('rank')
                ->get()
            : collect();

        return Inertia::render('RankingHome', [
            //'universities' => $universities,
            'ratingYear' => $latestYear,
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
