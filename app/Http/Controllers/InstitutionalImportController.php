<?php

namespace App\Http\Controllers;

use App\Services\InstitutionalRankingImportService;
use Illuminate\Http\Request;

class InstitutionalImportController extends Controller
{
    public function import(Request $request, InstitutionalRankingImportService $service)
{
    $request->validate([
        'file' => 'required|file'
    ]);

    $file = $request->file('file');

    $service->import($file->getRealPath());

    return back()->with('success', 'Импорт выполнен');
}
}