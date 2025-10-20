<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Business extends Model
{
    protected $fillable = [
        'user_id', 'name', 'whatsapp', 'email',
        'logo', 'address', 'short_note'
    ];

  


    public function owner() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function products() {
        return $this->hasMany(Product::class);
    }

    protected static function generateUniqueSlug($name)
    {
        $slug = Str::slug($name);
        $count = static::where('slug', 'LIKE', "{$slug}%")->count();
        return $count > 0 ? "{$slug}-{$count}" : $slug;
    }
}
