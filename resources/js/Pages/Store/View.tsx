import { useState, useEffect } from 'react';
import { Package, Share2, Search, Eye, ShoppingBag } from 'lucide-react';
import StorePageHeader from '@/Components/StorePageHeader';
import StorePageFooter from '@/Components/StorePageFooter';
import StoreAdminToolbar from '@/Components/StoreAdminToolbar';
import type { vendor, product } from '@/Types';
import { handleShare, openWhatsApp, formatPrice } from '@/Lib/utils';
import { useAnalytics, usePageViewTracking } from '@/Hooks/useAnalytics';
import { Head } from '@inertiajs/react';


const StoreListingPage = ({ business, is_owner = false }: any) => {
    const [vendor, setVendor] = useState<vendor | null>(null);
    const [products, setProducts] = useState<product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<product[]>([]);
    const [loading, setLoading] = useState(true);
    const [fadeIn, setFadeIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('featured');
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    const [coverImage, setCoverImage] = useState<string | null>(business.cover_image || null);
    usePageViewTracking(business.id, 'store_visited');
    const { trackEvent } = useAnalytics();

    useEffect(() => {
        setTimeout(() => {
            setVendor(business);
            setProducts(business.products || []);
            setFilteredProducts(business.products || []);
            setLoading(false);
            setFadeIn(true);
        }, 300);
    }, [business]);

    useEffect(() => {
        let filtered = [...products];

        if (activeCategory !== null) {
            filtered = filtered.filter((p: any) => p.category_id === activeCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        if (sortBy === 'price-low') {
            filtered.sort((a, b) => parseFloat(String(a.price).replace(/[^0-9.-]+/g, '')) - parseFloat(String(b.price).replace(/[^0-9.-]+/g, '')));
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => parseFloat(String(b.price).replace(/[^0-9.-]+/g, '')) - parseFloat(String(a.price).replace(/[^0-9.-]+/g, '')));
        }

        setFilteredProducts(filtered);
    }, [searchQuery, sortBy, products, activeCategory]);

    const viewProduct = (product: product) => {
        window.location.href = `/store/${vendor?.slug}/${product.slug || product.id}`;
    };

    const categories: { id: number; name: string }[] = business.categories || [];
    const countryCode = business.country?.code || 'US';

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAFA]">
                {/* Skeleton hero */}
                <div className="h-[340px] bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="rounded-2xl overflow-hidden">
                                <div className="aspect-[3/4] bg-gray-200 animate-pulse" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
                                    <div className="h-5 bg-gray-200 rounded-lg w-1/2 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

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

            <div className={`min-h-screen bg-[#FAFAFA] ${is_owner ? 'pt-12' : ''}`}>
                {/* Admin Toolbar */}
                {is_owner && (
                    <StoreAdminToolbar
                        businessId={business.id}
                        businessSlug={business.slug}
                        onBannerUpdate={(url: string) => setCoverImage(url)}
                    />
                )}

                <div className={`transition-all duration-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

                    {/* Hero Header */}
                    <StorePageHeader vendor={vendor} coverImage={coverImage} />

                    {/* Main Content */}
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">

                        {/* Search & Filter Section */}
                        <div className="mb-8 space-y-5">
                            {/* Search Row */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-white border-0 rounded-2xl shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-purple-500 text-sm placeholder:text-gray-400 transition-shadow"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-4 py-3.5 bg-white border-0 rounded-2xl shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-purple-500 text-sm cursor-pointer"
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="price-low">Price: Low → High</option>
                                        <option value="price-high">Price: High → Low</option>
                                    </select>
                                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap tabular-nums">
                                        {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
                                    </span>
                                </div>
                            </div>

                            {/* Category Chips */}
                            {categories.length > 0 && (
                                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
                                    <button
                                        onClick={() => setActiveCategory(null)}
                                        className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === null
                                            ? 'bg-gray-900 text-white shadow-md'
                                            : 'bg-white text-gray-500 ring-1 ring-gray-200 hover:ring-gray-300 hover:text-gray-700'
                                            }`}
                                    >
                                        All
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat.id
                                                ? 'bg-gray-900 text-white shadow-md'
                                                : 'bg-white text-gray-500 ring-1 ring-gray-200 hover:ring-gray-300 hover:text-gray-700'
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Products Grid */}
                        {filteredProducts.length === 0 ? (
                            <div className="py-20">
                                <div className="text-center max-w-sm mx-auto">
                                    <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
                                        <Package className="h-10 w-10 text-gray-300" />
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900 mb-2">
                                        {searchQuery || activeCategory ? 'No products found' : 'No products available yet'}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        {searchQuery || activeCategory ? 'Try adjusting your filters' : 'Check back soon for new arrivals!'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-20">
                                {filteredProducts.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className="group cursor-pointer"
                                        style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.06}s both` }}
                                        onClick={() => viewProduct(product)}
                                    >
                                        {/* Product Image */}
                                        <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[3/4] mb-3">
                                            <img
                                                src={product.images?.[0]?.url}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            />

                                            {/* Gradient overlay on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            {/* Price badge on image */}
                                            <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                                <span className="inline-block px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-xl text-sm font-bold text-gray-900 shadow-lg">
                                                    {formatPrice(product.price, countryCode)}
                                                </span>
                                            </div>

                                            {/* Image count */}
                                            {product.images && product.images.length > 1 && (
                                                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[11px] px-2 py-1 rounded-lg font-medium">
                                                    1/{product.images.length}
                                                </div>
                                            )}

                                            {/* Share button */}
                                            <button
                                                className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white shadow-md hover:scale-110"
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
                                                <Share2 className="w-4 h-4 text-gray-700" />
                                            </button>
                                        </div>

                                        {/* Product Info */}
                                        <div className="px-1 space-y-1">
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-purple-700 transition-colors duration-200">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm font-bold text-gray-900">
                                                {formatPrice(product.price, countryCode)}
                                            </p>
                                            {(product as any).category && (
                                                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">
                                                    {(product as any).category.name}
                                                </p>
                                            )}
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
                                    const message = `Hi, I'd like to inquire about your products at ${vendor.name}.`;
                                    window.open(`https://wa.me/${vendor.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
                                }
                            }}
                            className="relative w-14 h-14 bg-[#25D366] hover:bg-[#1da851] rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                            title="Chat on WhatsApp"
                        >
                            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <StorePageFooter vendor={vendor} />

                <style>{`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(16px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .scrollbar-hide::-webkit-scrollbar { display: none; }
                    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
            </div>
        </>
    );
};

export default StoreListingPage;