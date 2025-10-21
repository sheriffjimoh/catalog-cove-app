<?php

namespace App\Observers;

use App\Models\Business;
use Illuminate\Support\Str;

class BusinessObserver
{
    public function creating(Business $business)
    {
        $business->slug = $this->generateUniqueSlug($business->name);
    }

    public function updating(Business $business)
    {
        if ($business->isDirty('name')) {
            $business->slug = $this->generateUniqueSlug($business->name);
        }
    }

    public function saving(Business $business)
{
    if (empty($business->slug)) {
        $business->slug = $this->generateUniqueSlug($business->name);
    }
}

    private function generateUniqueSlug(string $name): string
    {
        $slug = Str::slug($name);
        $count = Business::where('slug', 'LIKE', "{$slug}%")->count();
        return $count > 0 ? "{$slug}-{$count}" : $slug;
    }
}
