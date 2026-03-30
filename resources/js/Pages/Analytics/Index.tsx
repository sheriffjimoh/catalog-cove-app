import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    TrendingUp,
    TrendingDown,
    Eye,
    MessageCircle,
    Store,
    Share2,
    Users,
    Award,
    Calendar,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

interface Business {
    id: number;
    name: string;
    slug: string;
}

interface AnalyticsOverview {
    store_visits: number;
    product_views: number;
    inquiries: number;
    shares: number;
    unique_visitors: number;
}

interface DailyTrend {
    [date: string]: {
        store_visits: number;
        product_views: number;
        inquiries: number;
    };
}

interface TopProduct {
    id: number;
    name: string;
    image: string;
    views: number;
    inquiries: number;
    conversion_rate: number;
}

interface Analytics {
    overview: AnalyticsOverview;
    daily_trends: DailyTrend;
    top_products: TopProduct[];
    conversion_rate: number;
}

interface Props {
    business: Business;
    analytics: Analytics;
    date_range: string;
}

const VendorAnalyticsDashboard = ({
    business,
    analytics,
    date_range,
}: Props) => {
    const [selectedRange, setSelectedRange] = useState(date_range);

    const handleDateRangeChange = (range: string) => {
        setSelectedRange(range);
        window.location.href = `/analytics?date_range=${range}`;
    };

    const formatNumber = (num: number): string => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + "K";
        }
        return num.toString();
    };

    const calculateTrend = (
        type: "store_visits" | "product_views" | "inquiries"
    ): number => {
        const dates = Object.keys(analytics.daily_trends).sort();
        if (dates.length < 2) return 0;

        const lastWeek = dates.slice(-7);
        const previousWeek = dates.slice(-14, -7);

        if (previousWeek.length === 0) return 0;

        const lastWeekTotal = lastWeek.reduce(
            (sum, date) => sum + (analytics.daily_trends[date]?.[type] || 0),
            0
        );
        const previousWeekTotal = previousWeek.reduce(
            (sum, date) => sum + (analytics.daily_trends[date]?.[type] || 0),
            0
        );

        if (previousWeekTotal === 0) return 100;

        return ((lastWeekTotal - previousWeekTotal) / previousWeekTotal) * 100;
    };

    const prepareChartData = () => {
        const dates = Object.keys(analytics.daily_trends).sort().slice(-30);
        return dates.map((date) => ({
            date: new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            store_visits: analytics.daily_trends[date]?.store_visits || 0,
            product_views: analytics.daily_trends[date]?.product_views || 0,
            inquiries: analytics.daily_trends[date]?.inquiries || 0,
        }));
    };

    const chartData = prepareChartData();
    const maxValue = Math.max(
        ...chartData.flatMap((d) => [
            d.store_visits,
            d.product_views,
            d.inquiries,
        ])
    );

    const TrendBadge = ({ value }: { value: number }) => (
        <Badge
            variant={value >= 0 ? "default" : "secondary"}
            className={
                value >= 0
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }
        >
            {value >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {Math.abs(value).toFixed(0)}%
        </Badge>
    );

    return (
        <AuthenticatedLayout>
            <Head title="Analytics Dashboard" />
            <div className="min-h-screen bg-slate-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-2">
                                Analytics Dashboard
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                Track your store performance for{" "}
                                <span className="font-semibold text-purple-700 dark:text-purple-400">
                                    {business.name}
                                </span>
                            </p>
                        </div>

                        {/* Date Range Filter */}
                        <div className="flex gap-2">
                            {["7", "30", "90"].map((days) => (
                                <Button
                                    key={days}
                                    variant={
                                        selectedRange === days
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() => handleDateRangeChange(days)}
                                    className={
                                        selectedRange === days
                                            ? "bg-purple-700 hover:bg-purple-800 text-white border-purple-700"
                                            : "bg-white dark:bg-gray-950 text-black dark:text-white border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
                                    }
                                >
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {days === "7"
                                        ? "Last 7 days"
                                        : days === "30"
                                            ? "Last 30 days"
                                            : "Last 90 days"}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Store Visits */}
                        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-none">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                        <Store className="w-5 h-5 text-purple-700 dark:text-purple-400" />
                                    </div>
                                    <TrendBadge value={calculateTrend("store_visits")} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-3xl font-bold text-black dark:text-white mb-1">
                                    {formatNumber(analytics.overview.store_visits)}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Store Visits
                                </p>
                            </CardContent>
                        </Card>

                        {/* Product Views */}
                        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-none">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                        <Eye className="w-5 h-5 text-purple-700 dark:text-purple-400" />
                                    </div>
                                    <TrendBadge value={calculateTrend("product_views")} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-3xl font-bold text-black dark:text-white mb-1">
                                    {formatNumber(analytics.overview.product_views)}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Product Views
                                </p>
                            </CardContent>
                        </Card>

                        {/* Inquiries */}
                        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-none">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                        <MessageCircle className="w-5 h-5 text-purple-700 dark:text-purple-400" />
                                    </div>
                                    <TrendBadge value={calculateTrend("inquiries")} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-3xl font-bold text-black dark:text-white mb-1">
                                    {formatNumber(analytics.overview.inquiries)}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Inquiries
                                </p>
                            </CardContent>
                        </Card>

                        {/* Shares */}
                        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-none">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                                        <Share2 className="w-5 h-5 text-black dark:text-white" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-3xl font-bold text-black dark:text-white mb-1">
                                    {formatNumber(analytics.overview.shares)}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Product Shares
                                </p>
                            </CardContent>
                        </Card>

                        {/* Unique Visitors */}
                        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-none">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                                        <Users className="w-5 h-5 text-black dark:text-white" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-3xl font-bold text-black dark:text-white mb-1">
                                    {formatNumber(analytics.overview.unique_visitors)}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Unique Visitors
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Conversion Rate Card */}
                    <Card className="border border-gray-200 dark:border-gray-800 bg-purple-700 shadow-none">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-200 mb-2">
                                        Conversion Rate
                                    </p>
                                    <h3 className="text-4xl font-bold text-white">
                                        {analytics.conversion_rate}%
                                    </h3>
                                    <p className="text-sm text-purple-200 mt-2">
                                        {analytics.overview.inquiries} inquiries
                                        from {analytics.overview.product_views}{" "}
                                        product views
                                    </p>
                                </div>
                                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                                    <Award className="w-10 h-10 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Trends Chart */}
                    <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-2xl text-black dark:text-white">
                                Performance Trends
                            </CardTitle>
                            <CardDescription className="text-gray-500 dark:text-gray-400">
                                Daily activity over the selected period
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Simple Bar Chart */}
                                <div className="h-64 flex items-end justify-center gap-2 px-4">
                                    {chartData.map((data, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="flex flex-col items-center"
                                                style={{ width: "60px" }}
                                            >
                                                {/* Bar container with fixed height */}
                                                <div
                                                    className="w-full flex flex-col-reverse gap-1"
                                                    style={{ height: "200px" }}
                                                >
                                                    {/* Store Visits - Dark Purple */}
                                                    {data.store_visits > 0 && (
                                                        <div
                                                            className="w-full bg-purple-700 hover:bg-purple-800 cursor-pointer transition-all"
                                                            style={{
                                                                height: `${(data.store_visits / maxValue) * 200}px`,
                                                                minHeight: "8px",
                                                            }}
                                                            title={`Store Visits: ${data.store_visits}`}
                                                        >
                                                            <span className="text-xs text-white font-bold flex items-center justify-center h-full">
                                                                {data.store_visits}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {/* Product Views - Light Purple */}
                                                    {data.product_views > 0 && (
                                                        <div
                                                            className="w-full bg-purple-400 hover:bg-purple-500 cursor-pointer transition-all"
                                                            style={{
                                                                height: `${(data.product_views / maxValue) * 200}px`,
                                                                minHeight: "8px",
                                                            }}
                                                            title={`Product Views: ${data.product_views}`}
                                                        >
                                                            <span className="text-xs text-white font-bold flex items-center justify-center h-full">
                                                                {data.product_views}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {/* Inquiries - Black */}
                                                    {data.inquiries > 0 && (
                                                        <div
                                                            className="w-full bg-black dark:bg-white rounded-t hover:bg-gray-800 dark:hover:bg-gray-200 cursor-pointer transition-all"
                                                            style={{
                                                                height: `${(data.inquiries / maxValue) * 200}px`,
                                                                minHeight: "8px",
                                                            }}
                                                            title={`Inquiries: ${data.inquiries}`}
                                                        >
                                                            <span className="text-xs text-white dark:text-black font-bold flex items-center justify-center h-full">
                                                                {data.inquiries}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-3 font-medium">
                                                    {data.date}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Legend */}
                                <div className="flex flex-wrap justify-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-purple-700 rounded"></div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Store Visits
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-purple-400 rounded"></div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Product Views
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-black dark:bg-white rounded"></div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Inquiries
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Products */}
                    <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-2xl text-black dark:text-white">
                                Top Performing Products
                            </CardTitle>
                            <CardDescription className="text-gray-500 dark:text-gray-400">
                                Your best products by views and inquiries
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {analytics.top_products.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No product data available yet
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {analytics.top_products.map(
                                        (product, index) => (
                                            <div
                                                key={product.id}
                                                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                {/* Rank */}
                                                <div className="flex-shrink-0 w-8 h-8 bg-purple-700 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                                    {index + 1}
                                                </div>

                                                {/* Product Image */}
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                                />

                                                {/* Product Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-black dark:text-white truncate">
                                                        {product.name}
                                                    </h4>
                                                    <div className="flex gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-4 h-4" />
                                                            {product.views}{" "}
                                                            views
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MessageCircle className="w-4 h-4" />
                                                            {product.inquiries}{" "}
                                                            inquiries
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Conversion Rate */}
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                                                        {product.conversion_rate}%
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        conversion
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default VendorAnalyticsDashboard;
