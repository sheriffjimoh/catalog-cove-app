<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        $countries = [
            // Africa
            ['name' => 'Nigeria', 'code' => 'NG', 'dial_code' => '+234', 'flag_emoji' => '🇳🇬'],
            ['name' => 'Ghana', 'code' => 'GH', 'dial_code' => '+233', 'flag_emoji' => '🇬🇭'],
            ['name' => 'Kenya', 'code' => 'KE', 'dial_code' => '+254', 'flag_emoji' => '🇰🇪'],
            ['name' => 'South Africa', 'code' => 'ZA', 'dial_code' => '+27', 'flag_emoji' => '🇿🇦'],
            ['name' => 'Egypt', 'code' => 'EG', 'dial_code' => '+20', 'flag_emoji' => '🇪🇬'],
            
            // North America
            ['name' => 'United States', 'code' => 'US', 'dial_code' => '+1', 'flag_emoji' => '🇺🇸'],
            ['name' => 'Canada', 'code' => 'CA', 'dial_code' => '+1', 'flag_emoji' => '🇨🇦'],
            ['name' => 'Mexico', 'code' => 'MX', 'dial_code' => '+52', 'flag_emoji' => '🇲🇽'],
            
            // Europe
            ['name' => 'United Kingdom', 'code' => 'GB', 'dial_code' => '+44', 'flag_emoji' => '🇬🇧'],
            ['name' => 'Germany', 'code' => 'DE', 'dial_code' => '+49', 'flag_emoji' => '🇩🇪'],
            ['name' => 'France', 'code' => 'FR', 'dial_code' => '+33', 'flag_emoji' => '🇫🇷'],
            ['name' => 'Spain', 'code' => 'ES', 'dial_code' => '+34', 'flag_emoji' => '🇪🇸'],
            ['name' => 'Italy', 'code' => 'IT', 'dial_code' => '+39', 'flag_emoji' => '🇮🇹'],
            
            // Asia
            ['name' => 'China', 'code' => 'CN', 'dial_code' => '+86', 'flag_emoji' => '🇨🇳'],
            ['name' => 'India', 'code' => 'IN', 'dial_code' => '+91', 'flag_emoji' => '🇮🇳'],
            ['name' => 'Japan', 'code' => 'JP', 'dial_code' => '+81', 'flag_emoji' => '🇯🇵'],
            ['name' => 'South Korea', 'code' => 'KR', 'dial_code' => '+82', 'flag_emoji' => '🇰🇷'],
            ['name' => 'Singapore', 'code' => 'SG', 'dial_code' => '+65', 'flag_emoji' => '🇸🇬'],
            ['name' => 'United Arab Emirates', 'code' => 'AE', 'dial_code' => '+971', 'flag_emoji' => '🇦🇪'],
            
            // Oceania
            ['name' => 'Australia', 'code' => 'AU', 'dial_code' => '+61', 'flag_emoji' => '🇦🇺'],
            ['name' => 'New Zealand', 'code' => 'NZ', 'dial_code' => '+64', 'flag_emoji' => '🇳🇿'],
            
            // South America
            ['name' => 'Brazil', 'code' => 'BR', 'dial_code' => '+55', 'flag_emoji' => '🇧🇷'],
            ['name' => 'Argentina', 'code' => 'AR', 'dial_code' => '+54', 'flag_emoji' => '🇦🇷'],
        ];

        foreach ($countries as $country) {
            Country::create($country);
        }
    }
}