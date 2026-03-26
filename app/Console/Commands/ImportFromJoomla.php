<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Symfony\Component\DomCrawler\Crawler;

class ImportFromJoomla extends Command
{
    protected $signature = 'import:joomla';

    public function handle()
    {
        $materials = DB::connection('joomla')
            ->table('jos_content') // заменить на реальное имя
            ->where('catid', 15)   // категория рейтинга
            ->get();

        foreach ($materials as $material) {

            $html = $material->fulltext ?? $material->introtext;

            $crawler = new Crawler($html);

            $crawler->filter('table tr')->each(function ($tr, $index) {

                if ($index === 0) return;

                $columns = $tr->filter('td');

                $rank = trim($columns->eq(0)->text());
                $university = trim($columns->eq(1)->text());
                $score = trim($columns->eq(2)->text());

                // тут вызываешь свой ImportService
            });
        }
    }
}