<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ticket;
use App\Services\TriageService;

class TicketController extends Controller
{

public function __construct(private TriageService $triage) {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tickets = Ticket::with('client')->get();
        return response()->json($tickets);
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
            'client_id'   => 'required|exists:clients,id',
            'titolo'      => 'required|string|max:255',
            'descrizione' => 'required|string',
            'priorita'    => 'sometimes|in:bassa,media,alta',
        ]);


        $triage = $this->triage->analizza($validated['titolo'], $validated['descrizione']);

        $ticket = Ticket::create([
            ...$validated,
            'categoria' => $triage['categoria'],
            'priorita'  => $validated['priorita'] ?? $triage['priorita'],
        ]);

    
        return response()->json($ticket->load('client'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         $ticket = Ticket::with(['client', 'messages.user'])->findOrFail($id);
        return response()->json($ticket);
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
           $ticket = Ticket::findOrFail($id);

        $validated = $request->validate([
            'titolo'      => 'sometimes|string|max:255',
            'descrizione' => 'sometimes|string',
            'status'      => 'sometimes|in:aperto,in_lavorazione,chiuso',
            'priorita'    => 'sometimes|in:bassa,media,alta',
            'categoria'   => 'nullable|string|max:255',
        ]);

        $ticket->update($validated);
        return response()->json($ticket);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
         Ticket::findOrFail($id)->delete();
        return response()->noContent();
    }
}
