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

    console.log("Analytics:", analytics);
    console.log("Chart Data:", chartData);
    console.log("Max Value:", maxValue);

    return (
        <AuthenticatedLayout>
            <Head title="Analytics Dashboard" />
            <div className="min-h-screen bg-slate-50   dark:bg-gray-800">
                <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                                Analytics Dashboard
                            </h1>
                            <p className="text-slate-600">
                                Track your store performance for{" "}
                                <span className="font-semibold text-purple-700">
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
                                            ? "bg-purple-700 hover:bg-purple-800"
                                            : "hover:bg-purple-50"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {/* Store Visits */}
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <Store className="w-6 h-6 text-purple-700" />
                                    </div>
                                    <Badge
                                        variant={
                                            calculateTrend("store_visits") >= 0
                                                ? "default"
                                                : "secondary"
                                        }
                                        className={
                                            calculateTrend("store_visits") >= 0
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }
                                    >
                                        {calculateTrend("store_visits") >= 0 ? (
                                            <TrendingUp className="w-3 h-3 mr-1" />
                                        ) : (
                                            <TrendingDown className="w-3 h-3 mr-1" />
                                        )}
                                        {Math.abs(
                                            calculateTrend("store_visits")
                                        ).toFixed(0)}
                                        %
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-3xl font-bold text-slate-900 mb-1">
                                    {formatNumber(
                                        analytics.overview.store_visits
                                    )}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Store Visits
                                </p>
                            </CardContent>
                        </Card>

                        {/* Product Views */}
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <Eye className="w-6 h-6 text-blue-700" />
                                    </div>
                                    <Badge
                                        variant={
                                            calculateTrend("product_views") >= 0
                                                ? "default"
                                                : "secondary"
                                        }
                                        className={
                                            calculateTrend("product_views") >= 0
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }
                                    >
                                        {calculateTrend("product_views") >=
                                        0 ? (
                                            <TrendingUp className="w-3 h-3 mr-1" />
                                        ) : (
                                            <TrendingDown className="w-3 h-3 mr-1" />
                                        )}
                                        {Math.abs(
                                            calculateTrend("product_views")
                                        ).toFixed(0)}
                                        %
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-3xl font-bold text-slate-900 mb-1">
                                    {formatNumber(
                                        analytics.overview.product_views
                                    )}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Product Views
                                </p>
                            </CardContent>
                        </Card>

                        {/* Inquiries */}
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <MessageCircle className="w-6 h-6 text-green-700" />
                                    </div>
                                    <Badge
                                        variant={
                                            calculateTrend("inquiries") >= 0
                                                ? "default"
                                                : "secondary"
                                        }
                                        className={
                                            calculateTrend("inquiries") >= 0
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }
                                    >
                                        {calculateTrend("inquiries") >= 0 ? (
                                            <TrendingUp className="w-3 h-3 mr-1" />
                                        ) : (
                                            <TrendingDown className="w-3 h-3 mr-1" />
                                        )}
                                        {Math.abs(
                                            calculateTrend("inquiries")
                                        ).toFixed(0)}
                                        %
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-3xl font-bold text-slate-900 mb-1">
                                    {formatNumber(analytics.overview.inquiries)}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Inquiries
                                </p>
                            </CardContent>
                        </Card>

                        {/* Shares */}
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                                        <Share2 className="w-6 h-6 text-pink-700" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-3xl font-bold text-slate-900 mb-1">
                                    {formatNumber(analytics.overview.shares)}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Product Shares
                                </p>
                            </CardContent>
                        </Card>

                        {/* Unique Visitors */}
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                        <Users className="w-6 h-6 text-orange-700" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-3xl font-bold text-slate-900 mb-1">
                                    {formatNumber(
                                        analytics.overview.unique_visitors
                                    )}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Unique Visitors
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Conversion Rate Card */}
                    <Card className="border-0 shadow-lg bg-purple-700 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 mb-2">
                                        Conversion Rate
                                    </p>
                                    <h3 className="text-4xl font-bold">
                                        {analytics.conversion_rate}%
                                    </h3>
                                    <p className="text-sm text-purple-100 mt-2">
                                        {analytics.overview.inquiries} inquiries
                                        from {analytics.overview.product_views}{" "}
                                        product views
                                    </p>
                                </div>
                                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                                    <Award className="w-10 h-10" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Trends Chart */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl text-slate-900">
                                Performance Trends
                            </CardTitle>
                            <CardDescription>
                                Daily activity over the selected period
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Simple Bar Chart */}
                                <div className="h-64 flex items-end justify-center gap-2 px-4">
                                    {chartData.map((data, index) => {
                                        const total =
                                            data.store_visits +
                                            data.product_views +
                                            data.inquiries;

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
                                                    {/* Store Visits - Purple */}
                                                    {data.store_visits > 0 && (
                                                        <div
                                                            className="w-full bg-purple-500 hover:bg-purple-600 cursor-pointer transition-all"
                                                            style={{
                                                                height: `${
                                                                    (data.store_visits /
                                                                        maxValue) *
                                                                    200
                                                                }px`,
                                                                minHeight:
                                                                    "8px",
                                                            }}
                                                            title={`Store Visits: ${data.store_visits}`}
                                                        >
                                                            <span className="text-xs text-white font-bold flex items-center justify-center h-full">
                                                                {
                                                                    data.store_visits
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                    {/* Product Views - Blue */}
                                                    {data.product_views > 0 && (
                                                        <div
                                                            className="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer transition-all"
                                                            style={{
                                                                height: `${
                                                                    (data.product_views /
                                                                        maxValue) *
                                                                    200
                                                                }px`,
                                                                minHeight:
                                                                    "8px",
                                                            }}
                                                            title={`Product Views: ${data.product_views}`}
                                                        >
                                                            <span className="text-xs text-white font-bold flex items-center justify-center h-full">
                                                                {
                                                                    data.product_views
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                    {/* Inquiries - Green */}
                                                    {data.inquiries > 0 && (
                                                        <div
                                                            className="w-full bg-green-500 rounded-t hover:bg-green-600 cursor-pointer transition-all"
                                                            style={{
                                                                height: `${
                                                                    (data.inquiries /
                                                                        maxValue) *
                                                                    200
                                                                }px`,
                                                                minHeight:
                                                                    "8px",
                                                            }}
                                                            title={`Inquiries: ${data.inquiries}`}
                                                        >
                                                            <span className="text-xs text-white font-bold flex items-center justify-center h-full">
                                                                {data.inquiries}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-xs text-slate-600 mt-3 font-medium">
                                                    {data.date}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Legend */}
                                <div className="flex flex-wrap justify-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-purple-500 rounded"></div>
                                        <span className="text-sm text-slate-600">
                                            Store Visits
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                        <span className="text-sm text-slate-600">
                                            Product Views
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                                        <span className="text-sm text-slate-600">
                                            Inquiries
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Products */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl text-slate-900">
                                Top Performing Products
                            </CardTitle>
                            <CardDescription>
                                Your best products by views and inquiries
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {analytics.top_products.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-slate-500">
                                        No product data available yet
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {analytics.top_products.map(
                                        (product, index) => (
                                            <div
                                                key={product.id}
                                                className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                                            >
                                                {/* Rank */}
                                                <div className="flex-shrink-0 w-8 h-8 bg-purple-700 text-white rounded-full flex items-center justify-center font-bold">
                                                    {index + 1}
                                                </div>

                                                {/* Product Image */}
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />

                                                {/* Product Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-slate-900 truncate">
                                                        {product.name}
                                                    </h4>
                                                    <div className="flex gap-4 mt-1 text-sm text-slate-600">
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
                                                    <div className="text-2xl font-bold text-purple-700">
                                                        {
                                                            product.conversion_rate
                                                        }
                                                        %
                                                    </div>
                                                    <div className="text-xs text-slate-500">
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
