<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TicketMessage;

class TicketMessageController extends Controller
{
    public function store(Request $request, int $ticketId)
    {
            $validated = $request->validate([
            'messaggio' => 'required|string',
            'user_id'   => 'required|exists:users,id',
        ]);

        $message = TicketMessage::create([
            'ticket_id' => $ticketId,
            'user_id'   => $validated['user_id'],
            'messaggio' => $validated['messaggio'],
        ]);

        return response()->json($message->load('user'), 201);
    }
}
