<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clients = Client::all();
        return response()->json($clients);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome'     => 'required|string|max:255',
            'email'    => 'required|email|unique:clients',
            'telefono' => 'nullable|string|max:20',
            'azienda'  => 'nullable|string|max:255',
        ]);

            $client = Client::create($validated);
            return response()->json($client, 201);

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $client = Client::with('tickets')->findOrFail($id);
        return response()->json($client,201);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $client = Client::findOrFail($id);

        $validated = $request->validate([
            'nome'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:clients,email,' . $id,
            'telefono' => 'nullable|string|max:20',
            'azienda'  => 'nullable|string|max:255',
        ]);

        $client->update($validated);
        return response()->json($client);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Client::findOrFail($id)->delete();
        return response()->noContent();
    }
    


}
