<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Article;
use Barryvdh\DomPDF\Facade\Pdf;

class GeneratePdf extends Command
{
    protected $signature = 'generate:pdf {id}';
    protected $description = 'Generate PDF for an article';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $id = $this->argument('id');
        $article = Article::find($id);

        if (!$article) {
            $this->error('Article not found');
            return;
        }

        $pdf = Pdf::loadView('pdf.article', ['article' => $article])->setPaper('a4')->setOptions(['isHtml5ParserEnabled' => true, 'isPhpEnabled' => true, 'language' => 'ru']);
        $pdf->save(storage_path('app/public/article_' . $id . '.pdf'));

        $this->info('PDF created for article ' . $id);
    }
}
