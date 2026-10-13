<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TicketMessageController;

Route::apiResource('clients', ClientController::class);
Route::apiResource('tickets', TicketController::class);
Route::post('/tickets/{ticketId}/messages', [TicketMessageController::class, 'store']);
