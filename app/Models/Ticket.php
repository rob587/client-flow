<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = [
        'client_id',
        'titolo',
        'descrizione',
        'status',
        'priorita',
        'categoria',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function messages()
    {
        return $this->hasMany(TicketMessage::class);
    }
}
