<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Business extends Model
{
    protected $fillable = [
        'user_id', 'name', 'whatsapp', 'email',
        'logo', 'cover_image', 'address', 'short_note',
        'tagline', 'country_id', 'has_selected_plan'
    ];

    protected $casts = [
        'has_selected_plan' => 'boolean',
    ];

  
    public function owner() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function products() {
        return $this->hasMany(Product::class);
    }

    public function categories() {
        return $this->hasMany(Category::class)->orderBy('sort_order');
    }

    protected static function generateUniqueSlug($name)
    {
        $slug = Str::slug($name);
        $count = static::where('slug', 'LIKE', "{$slug}%")->count();
        return $count > 0 ? "{$slug}-{$count}" : $slug;
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(\App\Models\Subscription::class);
    }

    public function usageRecords(): HasMany
    {
        return $this->hasMany(\App\Models\UsageRecord::class);
    }

    public function activeSubscription()
    {
        return $this->subscriptions()
            ->where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('current_period_end')
                      ->orWhere('current_period_end', '>', now());
            })
            ->first();
    }
}
