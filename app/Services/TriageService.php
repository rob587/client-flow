<?php

namespace App\Services;

use GuzzleHttp\Client;

class TriageService
{
    private Client $client;
    private string $apiKey;

    public function __construct()
    {
        $this->client = new Client([
        'verify' => false
    ]);
    $this->apiKey = config('services.groq.key');
    }

    public function analizza(string $titolo, string $descrizione): array
    {
        $prompt = "Analizza questo ticket di supporto e rispondi SOLO con un JSON valido senza markdown.
        
Titolo: {$titolo}
Descrizione: {$descrizione}

Rispondi esattamente in questo formato:
{\"categoria\": \"una tra: tecnico, fatturazione, accesso, generale\", \"priorita\": \"una tra: bassa, media, alta\"}";

        $response = $this->client->post('https://api.groq.com/openai/v1/chat/completions', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type'  => 'application/json',
            ],
            'json' => [
                'model'    => "openai/gpt-oss-20b",
                'messages' => [
                    ['role' => 'user', 'content' => $prompt]
                ],
                'temperature' => 0,
            ]
        ]);

        $body    = json_decode($response->getBody(), true);
        $content = $body['choices'][0]['message']['content'];

        return json_decode($content, true) ?? [
            'categoria' => 'generale',
            'priorita'  => 'media',
        ];
    }
}