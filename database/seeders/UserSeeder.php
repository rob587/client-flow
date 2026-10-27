<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        User::create([
            'name'     => 'Admin',
            'email'    => 'admin@clientflow.it',
            'password' => Hash::make('password123'),
            'role'     => 'admin',
        ]);

        User::create([
            'name'     => 'Operatore',
            'email'    => 'operatore@clientflow.it',
            'password' => Hash::make('password123'),
            'role'     => 'operatore',
        ]);
    }
}
