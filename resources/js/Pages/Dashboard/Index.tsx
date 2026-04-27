import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Package,
    Eye,
    MessageCircle,
    Users,
    ExternalLink,
    ArrowUpRight,
    Copy,
    CheckCircle2,
    BarChart3,
    TrendingUp,
    Crown,
    FileText,
    Clock,
} from 'lucide-react';
import { useState } from 'react';
import { formatPrice } from '@/Lib/utils';

interface Stats {
    totalProducts: number;
    publishedProducts: number;
    draftProducts: number;
    totalViews: number;
    productViews: number;
    whatsappClicks: number;
    uniqueVisitors: number;
}

interface ViewDay {
    date: string;
    views: number;
}

interface RecentProduct {
    id: number;
    name: string;
    price: string;
    stock: number;
    is_published: boolean;
    image: string | null;
    slug: string;
}

interface TopProduct {
    id: number;
    name: string;
    views: number;
}

interface Props {
    stats: Stats;
    viewsPerDay: ViewDay[];
    recentProducts: RecentProduct[];
    topProducts: TopProduct[];
    planName: string;
    storeUrl: string;
    countryCode: string;
}

export default function Dashboard() {
    const { stats, viewsPerDay, recentProducts, topProducts, planName, storeUrl, countryCode } = usePage().props as unknown as Props;
    const business = usePage().props.business as { name: string; slug: string; logo: string | null } | null;
    const [copied, setCopied] = useState(false);

    const copyStoreLink = () => {
        navigator.clipboard.writeText(storeUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const maxViews = Math.max(...viewsPerDay.map(d => d.views), 1);

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-slate-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-black dark:text-white">
                                Dashboard
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Welcome back, {business?.name || 'Business'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-full">
                                <Crown className="w-3.5 h-3.5" />
                                {planName}
                            </span>
                        </div>
                    </div>

                    {/* Store Link Card */}
                    <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 bg-white dark:bg-slate-900">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-700 rounded-xl flex items-center justify-center">
                                    <ExternalLink className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Your Store</p>
                                    <p className="text-base font-semibold text-black dark:text-white truncate max-w-md">
                                        {storeUrl}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={copyStoreLink}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 text-purple-700" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Copy Link
                                        </>
                                    )}
                                </button>
                                <a
                                    href={storeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-medium transition-colors"
                                >
                                    Visit Store
                                    <ArrowUpRight className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Total Products */}
                        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 bg-white dark:bg-slate-900">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                    <Package className="w-5 h-5 text-purple-700 dark:text-purple-400" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-black dark:text-white">{stats.totalProducts}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Products</p>
                            <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-purple-700" />
                                    {stats.publishedProducts} published
                                </span>
                                <span className="flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    {stats.draftProducts} drafts
                                </span>
                            </div>
                        </div>

                        {/* Store Views */}
                        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 bg-white dark:bg-slate-900">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                    <Eye className="w-5 h-5 text-purple-700 dark:text-purple-400" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-black dark:text-white">{stats.totalViews}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Store Views</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Last 30 days</p>
                        </div>

                        {/* Unique Visitors */}
                        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 bg-white dark:bg-slate-900">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                    <Users className="w-5 h-5 text-purple-700 dark:text-purple-400" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-black dark:text-white">{stats.uniqueVisitors}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Unique Visitors</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Last 30 days</p>
                        </div>

                        {/* WhatsApp Clicks */}
                        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 bg-white dark:bg-slate-900">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                    <MessageCircle className="w-5 h-5 text-purple-700 dark:text-purple-400" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-black dark:text-white">{stats.whatsappClicks}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">WhatsApp Clicks</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Last 30 days</p>
                        </div>
                    </div>

                    {/* Charts & Lists Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Views Chart (7 days) */}
                        <div className="lg:col-span-2 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 bg-white dark:bg-slate-900">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-black dark:text-white">Store Views</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Last 7 days</p>
                                </div>
                                <BarChart3 className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex items-end justify-between gap-2 h-40">
                                {viewsPerDay.map((day, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full flex justify-center">
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                {day.views}
                                            </span>
                                        </div>
                                        <div className="w-full flex justify-center" style={{ height: '120px' }}>
                                            <div
                                                className="w-full max-w-[40px] bg-purple-700 rounded-t-lg transition-all duration-300"
                                                style={{
                                                    height: `${Math.max((day.views / maxViews) * 100, 4)}%`,
                                                    alignSelf: 'flex-end',
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {day.date}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Products */}
                        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 bg-white dark:bg-slate-900">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-black dark:text-white">Top Products</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">By views</p>
                                </div>
                                <TrendingUp className="w-5 h-5 text-gray-400" />
                            </div>
                            {topProducts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Eye className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-3" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No product views yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {topProducts.map((product, i) => (
                                        <div key={product.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="text-sm font-bold text-gray-300 dark:text-gray-600 w-5 text-center flex-shrink-0">
                                                    {i + 1}
                                                </span>
                                                <p className="text-sm font-medium text-black dark:text-white truncate">
                                                    {product.name}
                                                </p>
                                            </div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                                                {product.views} views
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Products */}
                    <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 bg-white dark:bg-slate-900">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-black dark:text-white">Recent Products</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Your latest additions</p>
                            </div>
                            <Link
                                href="/products"
                                className="text-sm font-medium text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center gap-1"
                            >
                                View all
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {recentProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                                <h4 className="text-base font-medium text-black dark:text-white mb-1">No products yet</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    Start by adding your first product to your store.
                                </p>
                                <Link
                                    href="/products/create"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-medium transition-colors"
                                >
                                    Add Product
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800">
                                            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">Product</th>
                                            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">Price</th>
                                            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">Stock</th>
                                            <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {recentProducts.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                                <td className="py-3 pr-4">
                                                    <div className="flex items-center gap-3">
                                                        {product.image ? (
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                                <Package className="w-5 h-5 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <Link
                                                            href={`/products/${product.id}/edit`}
                                                            className="text-sm font-medium text-black dark:text-white hover:text-purple-700 dark:hover:text-purple-400 transition-colors"
                                                        >
                                                            {product.name}
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <span className="text-sm text-black dark:text-white">
                                                        {product.price ? formatPrice(product.price, countryCode) : '—'}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <span className="text-sm text-black dark:text-white">
                                                        {product.stock ?? '—'}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${product.is_published
                                                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                        }`}>
                                                        {product.is_published ? (
                                                            <>
                                                                <CheckCircle2 className="w-3 h-3" />
                                                                Published
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Clock className="w-3 h-3" />
                                                                Draft
                                                            </>
                                                        )}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link
                            href="/products/create"
                            className="flex items-center gap-4 p-5 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-slate-900 hover:border-purple-300 dark:hover:border-purple-700 transition-colors group"
                        >
                            <div className="w-10 h-10 bg-purple-700 rounded-xl flex items-center justify-center">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-black dark:text-white">Add Product</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Create a new product listing</p>
                            </div>
                        </Link>

                        <Link
                            href="/analytics"
                            className="flex items-center gap-4 p-5 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-slate-900 hover:border-purple-300 dark:hover:border-purple-700 transition-colors group"
                        >
                            <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-white dark:text-black" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-black dark:text-white">View Analytics</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Detailed store insights</p>
                            </div>
                        </Link>

                        <Link
                            href="/settings/business-information"
                            className="flex items-center gap-4 p-5 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-slate-900 hover:border-purple-300 dark:hover:border-purple-700 transition-colors group"
                        >
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                <Crown className="w-5 h-5 text-purple-700 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-black dark:text-white">Settings</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Manage your business</p>
                            </div>
                        </Link>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
