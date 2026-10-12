<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'nome',
        'email',
        'telefono',
        'azienda',
    ];

    public function tickets(){
        return $this->hasMany(Ticket::class);
    }
}
