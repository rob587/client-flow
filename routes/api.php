<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TicketMessageController;
use App\Http\Controllers\AuthController;


// Rotte pubbliche
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rotte protette
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('role:admin,operatore')->group(function () {
        Route::apiResource('clients', ClientController::class);
        Route::apiResource('tickets', TicketController::class);
        Route::post('/tickets/{ticketId}/messages', [TicketMessageController::class, 'store']);
    });

    Route::middleware('role:cliente')->group(function () {
        Route::post('/tickets', [TicketController::class, 'store']);
        Route::get('/tickets/{id}', [TicketController::class, 'show']);
    });

    Route::middleware('role:cliente')->group(function () {
    Route::get('/miei-ticket', [TicketController::class, 'mieiTicket']);
    Route::post('/miei-ticket', [TicketController::class, 'storeMio']);
});
});