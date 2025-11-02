<?php

namespace App\Services;

use App\Enums\AnalyticsEventType;
use App\Models\AnalyticsEvent;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsService
{
    public function trackEvent(
        int $businessId,
        AnalyticsEventType $eventType,
        ?int $productId = null,
        array $metadata = []
    ): void {
        AnalyticsEvent::create([
            'business_id' => $businessId,
            'product_id' => $productId,
            'event_type' => $eventType->value,
            'visitor_id' => $metadata['visitor_id'] ?? $this->generateVisitorId(),
            'device_type' => $metadata['device_type'] ?? $this->detectDeviceType(),
            'referrer' => $metadata['referrer'] ?? request()->header('referer'),
            'ip_address' => $metadata['ip_address'] ?? request()->ip(),
        ]);
    }

    public function getBusinessAnalytics(int $businessId, Carbon $startDate, Carbon $endDate): array
    {
        $baseQuery = AnalyticsEvent::where('business_id', $businessId)
            ->whereBetween('created_at', [$startDate, $endDate]);

        return [
            'overview' => [
                'store_visits' => (clone $baseQuery)->where('event_type', AnalyticsEventType::STORE_VISITED->value)->count(),
                'product_views' => (clone $baseQuery)->where('event_type', AnalyticsEventType::PRODUCT_VIEWED->value)->count(),
                'inquiries' => (clone $baseQuery)->where('event_type', AnalyticsEventType::INQUIRY_SENT->value)->count(),
                'shares' => (clone $baseQuery)->where('event_type', AnalyticsEventType::PRODUCT_SHARED->value)->count(),
                'unique_visitors' => (clone $baseQuery)->distinct('visitor_id')->count('visitor_id'),
            ],
            'daily_trends' => $this->getDailyTrends($businessId, $startDate, $endDate),
            'top_products' => $this->getTopProducts($businessId, $startDate, $endDate),
            'conversion_rate' => $this->getConversionRate($businessId, $startDate, $endDate),
        ];
    }

    private function getDailyTrends(int $businessId, Carbon $startDate, Carbon $endDate): array
    {
        return AnalyticsEvent::where('business_id', $businessId)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select(
                DB::raw('DATE(created_at) as date'),
                'event_type',
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('date', 'event_type')
            ->orderBy('date')
            ->get()
            ->groupBy('date')
            ->map(function ($events) {
                return [
                    'store_visits' => $events->where('event_type', AnalyticsEventType::STORE_VISITED->value)->sum('count'),
                    'product_views' => $events->where('event_type', AnalyticsEventType::PRODUCT_VIEWED->value)->sum('count'),
                    'inquiries' => $events->where('event_type', AnalyticsEventType::INQUIRY_SENT->value)->sum('count'),
                ];
            })
            ->toArray();
    }

    private function getTopProducts(int $businessId, Carbon $startDate, Carbon $endDate): array
    {
        $views = AnalyticsEvent::where('business_id', $businessId)
            ->where('event_type', AnalyticsEventType::PRODUCT_VIEWED->value)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereNotNull('product_id')
            ->select('product_id', DB::raw('COUNT(*) as views'))
            ->groupBy('product_id')
            ->pluck('views', 'product_id');

        $inquiries = AnalyticsEvent::where('business_id', $businessId)
            ->where('event_type', AnalyticsEventType::INQUIRY_SENT->value)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereNotNull('product_id')
            ->select('product_id', DB::raw('COUNT(*) as inquiries'))
            ->groupBy('product_id')
            ->pluck('inquiries', 'product_id');

        $productIds = $views->keys()->merge($inquiries->keys())->unique();

        return \App\Models\Product::whereIn('id', $productIds)
            ->with('images')
            ->get()
            ->map(function ($product) use ($views, $inquiries) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'image' => $product->images->first()?->url,
                    'views' => $views->get($product->id, 0),
                    'inquiries' => $inquiries->get($product->id, 0),
                    'conversion_rate' => $views->get($product->id, 0) > 0 
                        ? round(($inquiries->get($product->id, 0) / $views->get($product->id, 0)) * 100, 1)
                        : 0,
                ];
            })
            ->sortByDesc('views')
            ->take(5)
            ->values()
            ->toArray();
    }

    private function getConversionRate(int $businessId, Carbon $startDate, Carbon $endDate): float
    {
        $productViews = AnalyticsEvent::where('business_id', $businessId)
            ->where('event_type', AnalyticsEventType::PRODUCT_VIEWED->value)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        $inquiries = AnalyticsEvent::where('business_id', $businessId)
            ->where('event_type', AnalyticsEventType::INQUIRY_SENT->value)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        return $productViews > 0 ? round(($inquiries / $productViews) * 100, 1) : 0;
    }

    private function generateVisitorId(): string
    {
        return request()->cookie('visitor_id') ?? 'visitor_' . uniqid();
    }

    private function detectDeviceType(): string
    {
        $userAgent = request()->userAgent();
        
        if (preg_match('/mobile|android|iphone/i', $userAgent)) {
            return 'mobile';
        } elseif (preg_match('/tablet|ipad/i', $userAgent)) {
            return 'tablet';
        }
        
        return 'desktop';
    }
}