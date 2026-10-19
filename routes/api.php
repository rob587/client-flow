<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TicketMessageController;
use App\Http\Controllers\AuthController;


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Solo admin e operatore gestiscono clienti e ticket
    Route::middleware('role:admin,operatore')->group(function () {
        Route::apiResource('clients', ClientController::class);
        Route::apiResource('tickets', TicketController::class);
        Route::post('/tickets/{ticketId}/messages', [TicketMessageController::class, 'store']);
    });

    // Il cliente può solo creare ticket e vedere i suoi
    Route::middleware('role:cliente')->group(function () {
        Route::post('/tickets', [TicketController::class, 'store']);
        Route::get('/tickets/{id}', [TicketController::class, 'show']);
    });
});