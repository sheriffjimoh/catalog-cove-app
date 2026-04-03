import { useState, useEffect } from 'react';
import { Badge } from '@/Components/ui/badge';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { MessageCircle, Package, Share2, Star, ShoppingBag, Search, Eye } from 'lucide-react';
import StorePageHeader from '@/Components/StorePageHeader';
import StorePageFooter from '@/Components/StorePageFooter';
import type { vendor, product } from '@/Types';
import { handleShare, openWhatsApp, formatPrice } from '@/Lib/utils';
import { useAnalytics, usePageViewTracking } from '@/Hooks/useAnalytics';
import { Head } from '@inertiajs/react';


const StoreListingPage = ({ business }: any) => {
    const [vendor, setVendor] = useState<vendor | null>(null);
    const [products, setProducts] = useState<product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<product[]>([]);
    const [loading, setLoading] = useState(true);
    const [fadeIn, setFadeIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('featured');
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    usePageViewTracking(business.id, 'store_visited');
    const { trackEvent } = useAnalytics();

    useEffect(() => {
        setTimeout(() => {
            setVendor(business);
            setProducts(business.products || []);
            setFilteredProducts(business.products || []);
            setLoading(false);
            setFadeIn(true);
        }, 400);
    }, [business]);

    useEffect(() => {
        let filtered = [...products];

        // Category filter
        if (activeCategory !== null) {
            filtered = filtered.filter((p: any) => p.category_id === activeCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (sortBy === 'price-low') {
            filtered.sort((a, b) => parseFloat(a.price.replace(/[^0-9.-]+/g, '')) - parseFloat(b.price.replace(/[^0-9.-]+/g, '')));
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => parseFloat(b.price.replace(/[^0-9.-]+/g, '')) - parseFloat(a.price.replace(/[^0-9.-]+/g, '')));
        } else if (sortBy === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        }

        setFilteredProducts(filtered);
    }, [searchQuery, sortBy, products, activeCategory]);

    const viewProduct = (product: product) => {
        window.location.href = `/store/${vendor?.slug}/${product.slug || product.id}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-pulse">
                    <div className="bg-gray-100 rounded-3xl h-64 md:h-72"></div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-gray-100 rounded-2xl h-72 md:h-80"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const categories: { id: number; name: string }[] = business.categories || [];
    const countryCode = business.country?.code || 'NG';

    const publishedCount = products.filter(p => p).length;

    return (
        <>
            <Head title={`${vendor?.name} - Store`}>
                <meta name="description" content={vendor?.short_note || `Shop at ${vendor?.name}`} />
                <meta property="og:title" content={`${vendor?.name} - Store`} />
                <meta property="og:description" content={vendor?.short_note || `Browse products from ${vendor?.name}`} />
                {(business.cover_image || vendor?.logo_url) && (
                    <meta property="og:image" content={business.cover_image || vendor?.logo_url} />
                )}
                <meta property="og:type" content="website" />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <div className={`transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>

                    {/* Hero Header */}
                    <StorePageHeader vendor={vendor} />

                    {/* Main Content */}
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-6">

                        {/* Search & Filter Bar */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Search */}
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-gray-50 text-sm"
                                    />
                                </div>

                                {/* Sort & Count */}
                                <div className="flex items-center gap-3">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 bg-gray-50 text-sm"
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="rating">Top Rated</option>
                                    </select>
                                    <Badge variant="secondary" className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 border-0 whitespace-nowrap">
                                        {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Category Filter Chips */}
                        {categories.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
                                <button
                                    onClick={() => setActiveCategory(null)}
                                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                        activeCategory === null
                                            ? 'bg-purple-700 text-white shadow-sm'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-700'
                                    }`}
                                >
                                    All
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                            activeCategory === cat.id
                                                ? 'bg-purple-700 text-white shadow-sm'
                                                : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-700'
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Products Header */}
                        <div className="flex items-center gap-3 px-1">
                            <ShoppingBag className="w-5 h-5 text-purple-700" />
                            <h2 className="text-xl md:text-2xl font-bold text-black">Products</h2>
                        </div>

                        {/* Products Grid */}
                        {filteredProducts.length === 0 ? (
                            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 md:p-16">
                                <div className="text-center max-w-sm mx-auto">
                                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Package className="h-8 w-8 text-purple-700" />
                                    </div>
                                    <p className="text-lg font-semibold text-black mb-2">
                                        {searchQuery ? 'No products found' : 'No products available yet'}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {searchQuery ? 'Try adjusting your search' : 'Check back soon for new arrivals!'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 pb-20">
                                {filteredProducts.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer"
                                        style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.04}s both` }}
                                        onClick={() => viewProduct(product)}
                                    >
                                        {/* Image */}
                                        <div className="relative overflow-hidden aspect-square bg-gray-100">
                                            <img
                                                src={product.images[0]?.url}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />

                                            {/* Image count indicator */}
                                            {product.images.length > 1 && (
                                                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
                                                    1/{product.images.length}
                                                </div>
                                            )}

                                            {/* Share button */}
                                            <button
                                                className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white shadow-sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    trackEvent({
                                                        businessId: business.id,
                                                        eventType: 'product_shared',
                                                        productId: product.id,
                                                    });
                                                    handleShare(product);
                                                }}
                                            >
                                                <Share2 className="w-3.5 h-3.5 text-gray-600" />
                                            </button>
                                        </div>

                                        {/* Info */}
                                        <div className="p-3 md:p-4 space-y-2">
                                            <h3 className="text-sm md:text-base font-semibold text-black line-clamp-1 group-hover:text-purple-700 transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed hidden md:block">
                                                {product.description}
                                            </p>
                                            <div className="flex items-center justify-between pt-1">
                                                <span className="text-base md:text-lg font-bold text-purple-700">
                                                    {formatPrice(product.price, countryCode)}
                                                </span>
                                                <button
                                                    className="flex items-center gap-1 text-xs text-purple-700 font-medium hover:text-purple-800 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        viewProduct(product);
                                                    }}
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span className="hidden sm:inline">View</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Floating WhatsApp Button */}
                    <div className="fixed bottom-6 right-6 z-50">
                        <button
                            onClick={() => {
                                if (vendor?.whatsapp) {
                                    trackEvent({
                                        businessId: business.id,
                                        eventType: 'inquiry_sent',
                                    });
                                }
                                openWhatsApp(vendor!, null!)
                            }}
                            className="relative w-14 h-14 bg-black hover:bg-gray-900 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
                            title="Chat on WhatsApp"
                        >
                            <MessageCircle className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>

                <StorePageFooter vendor={vendor} />

                <style>{`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>
            </div>
        </>
    );
};

export default StoreListingPage;