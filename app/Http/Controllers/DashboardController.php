<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\AnalyticsEvent;
use App\Models\Product;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $business = $user->business;

        // Product stats
        $totalProducts = $business->products()->count();
        $publishedProducts = $business->products()->where('is_published', true)->count();
        $draftProducts = $totalProducts - $publishedProducts;

        // Analytics - last 30 days
        $thirtyDaysAgo = Carbon::now()->subDays(30);

        $totalViews = AnalyticsEvent::where('business_id', $business->id)
            ->where('event_type', 'page_view')
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->count();

        $productViews = AnalyticsEvent::where('business_id', $business->id)
            ->where('event_type', 'product_view')
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->count();

        $whatsappClicks = AnalyticsEvent::where('business_id', $business->id)
            ->where('event_type', 'whatsapp_click')
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->count();

        $uniqueVisitors = AnalyticsEvent::where('business_id', $business->id)
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->distinct('visitor_id')
            ->count('visitor_id');

        // Views per day for chart (last 7 days)
        $viewsPerDay = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $count = AnalyticsEvent::where('business_id', $business->id)
                ->where('event_type', 'page_view')
                ->whereDate('created_at', $date->toDateString())
                ->count();
            $viewsPerDay[] = [
                'date' => $date->format('D'),
                'views' => $count,
            ];
        }

        // Recent products (latest 5)
        $recentProducts = $business->products()
            ->with('images')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'stock' => $product->stock,
                    'is_published' => $product->is_published,
                    'image' => $product->images->first()?->image_path,
                    'slug' => $product->slug,
                ];
            });

        // Top products by views (last 30 days)
        $topProducts = AnalyticsEvent::where('business_id', $business->id)
            ->where('event_type', 'product_view')
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->whereNotNull('product_id')
            ->selectRaw('product_id, COUNT(*) as views')
            ->groupBy('product_id')
            ->orderByDesc('views')
            ->limit(5)
            ->get()
            ->map(function ($event) {
                $product = Product::find($event->product_id);
                return [
                    'id' => $event->product_id,
                    'name' => $product?->name ?? 'Deleted Product',
                    'views' => $event->views,
                ];
            });

        // Subscription info
        $subscription = $business->activeSubscription();
        $plan = $subscription?->plan;

        // Store URL
        $storeUrl = url('/store/' . $business->slug);

        return Inertia::render('Dashboard/Index', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'publishedProducts' => $publishedProducts,
                'draftProducts' => $draftProducts,
                'totalViews' => $totalViews,
                'productViews' => $productViews,
                'whatsappClicks' => $whatsappClicks,
                'uniqueVisitors' => $uniqueVisitors,
            ],
            'viewsPerDay' => $viewsPerDay,
            'recentProducts' => $recentProducts,
            'topProducts' => $topProducts,
            'planName' => $plan?->name ?? 'Free',
            'storeUrl' => $storeUrl,
            'countryCode' => $business->country?->code ?? 'US',
        ]);
    }
}