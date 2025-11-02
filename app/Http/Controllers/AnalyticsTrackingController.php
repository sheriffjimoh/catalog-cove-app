<?php

namespace App\Http\Controllers;

use App\Enums\AnalyticsEventType;
use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsTrackingController extends Controller
{
    public function __construct(private AnalyticsService $analyticsService)
    {
    }


    public function index(Request $request): Response
    {
        $business = $request->user()->business; // Assuming vendor has one business
        
        $dateRange = $request->input('date_range', '30'); // Default 30 days
        $endDate = Carbon::now();
        $startDate = Carbon::now()->subDays((int) $dateRange);

        $analytics = $this->analyticsService->getBusinessAnalytics(
            $business->id,
            $startDate,
            $endDate
        );

        return Inertia::render('Analytics/Index', [
            'business' => $business,
            'analytics' => $analytics,
            'date_range' => $dateRange,
        ]);
    }

    public function track(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'event_type' => 'required|in:store_visited,product_viewed,inquiry_sent,product_shared',
            'product_id' => 'nullable|exists:products,id',
            'visitor_id' => 'required|string|max:64',
        ]);

        $this->analyticsService->trackEvent(
            businessId: $validated['business_id'],
            eventType: AnalyticsEventType::from($validated['event_type']),
            productId: $validated['product_id'] ?? null,
            metadata: [
                'visitor_id' => $validated['visitor_id'],
            ]
        );

        return response()->json(['success' => true]);
    }
}