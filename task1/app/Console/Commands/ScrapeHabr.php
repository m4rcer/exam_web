<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use GuzzleHttp\Client;
use Symfony\Component\DomCrawler\Crawler;
use App\Models\Article;

class ScrapeHabr extends Command
{
    protected $signature = 'scrape:habr';
    protected $description = 'Scrape Habr for articles';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $this->info('Starting the scraping process...');


        $periods = ['daily', 'weekly', 'monthly', 'yearly', 'alltime'];
        foreach ($periods as $period) {

            $client = new Client([
                'verify' => false,
            ]);
            $url = 'https://habr.com/ru/top/'.$period;
            $response = $client->get($url);

            $this->info('Successfully fetched the URL.');

            $html = (string)$response->getBody();
            $crawler = new Crawler($html);
            $this->info('Starting to parse the HTML.');

            $crawler->filter('.tm-articles-list__item')->each(function (Crawler $node) {
                try {


                    $title = $node->filter('.tm-title__link span')->text();
                    $description = $node->filter('.article-formatted-body.article-formatted-body.article-formatted-body_version-1')->text();
                    $rating = $node->filter('.tm-votes-meter__value.tm-votes-meter__value_positive.tm-votes-meter__value_appearance-article.tm-votes-meter__value_rating.tm-votes-meter__value')->text();
                    $views = $node->filter('.tm-icon-counter__value')->text();
                    $author = $node->filter('.tm-user-info__username')->text();
                    $date = $node->filter('.tm-article-datetime-published.tm-article-datetime-published_link>time')->attr('datetime');
                    $type = 'daily';
                    $this->info("Parsed article: $title");

                    $existingArticle = Article::where('title', $title)
                        ->where('description', $description)
                        ->where('author', $author)
                        ->where('date', $date)
                        ->where('type', $type)
                        ->first();

                    if (!$existingArticle) {
                        Article::create([
                            'title' => $title,
                            'description' => $description,
                            'rating' => $rating,
                            'views' => $views,
                            'author' => $author,
                            'type' => $type,
                            'date' => $date,
                        ]);
                        $this->info('Article inserted: ' . $title);
                    } else {
                        $this->info('Article already exists: ' . $title);
                    }
                } catch (\Exception $e) {
                }
            });
        }
        $this->info('Scraping process completed.');

    }
}
