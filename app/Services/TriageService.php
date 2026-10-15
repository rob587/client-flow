<?php

namespace App\Services;

use GuzzleHttp\Client;

class TriageService
{
    private Client $client;
    private string $apiKey;

    public function __construct()
    {
        $this->client = new Client();
        $this->apiKey = config('services.groq.key');
    }
}