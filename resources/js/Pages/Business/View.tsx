import  { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import {  MessageCircle, Package, Share2, Star,  ShoppingBag, TrendingUp,  Clock, Eye, Search } from 'lucide-react';
import StorePageHeader from '@/Components/StorePageHeader';
import StorePageFooter from '@/Components/StorePageFooter';
import type { vendor, product } from '@/Types';
import { handleShare, openWhatsApp } from '@/Lib/utils';
import { useAnalytics, usePageViewTracking } from '@/Hooks/useAnalytics';
import { Head } from '@inertiajs/react';



const StoreListingPage = ({ business }: any) => {
    const [vendor, setVendor] = useState<vendor | null>(null);
    const [products, setProducts] = useState<product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<product[]>([]);
    const [loading, setLoading] = useState(true);
    const [fadeIn, setFadeIn] = useState(false);
    const [likedProducts, setLikedProducts] = useState(new Set<number>());
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('featured');
    usePageViewTracking(business.id, 'store_visited');
    const { trackEvent } = useAnalytics();


    useEffect(() => {
        setTimeout(() => {
            setVendor(business);
            setProducts(business.products || []);
            setFilteredProducts(business.products || []);
            setLoading(false);
            setFadeIn(true);
        }, 600);
    }, [business]);

    useEffect(() => {
        let filtered = [...products];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort
        if (sortBy === 'price-low') {
            filtered.sort((a, b) => parseFloat(a.price.replace(/[^0-9.-]+/g, '')) - parseFloat(b.price.replace(/[^0-9.-]+/g, '')));
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => parseFloat(b.price.replace(/[^0-9.-]+/g, '')) - parseFloat(a.price.replace(/[^0-9.-]+/g, '')));
        } else if (sortBy === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        }

        setFilteredProducts(filtered);
    }, [searchQuery, sortBy, products]);

 
    const viewProduct = (product: product) => {
        window.location.href = `/store/${vendor?.slug}/${product.slug || product.id}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-pulse">
                    <div className="bg-gray-50 rounded-3xl p-8 h-72"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl h-96"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
      <>
      <Head title={`${vendor?.name} - Front Store `} />
        <div className="min-h-screen bg-white">
            <div className={`transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
                
                {/* Premium Store Header */}
                 <StorePageHeader vendor={vendor} />
                {/* Main Content */}
                <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
                    
                    {/* Store Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="border border-gray-200 shadow-none bg-white">
                            <CardContent className="p-4 text-center">
                                <Package className="w-8 h-8 text-purple-700 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-black">{products.length}</p>
                                <p className="text-xs text-gray-500">Products</p>
                            </CardContent>
                        </Card>
                        <Card className="border border-gray-200 shadow-none bg-white">
                            <CardContent className="p-4 text-center">
                                <Star className="w-8 h-8 text-purple-700 mx-auto mb-2 fill-purple-700" />
                                <p className="text-2xl font-bold text-black">4.8</p>
                                <p className="text-xs text-gray-500">Rating</p>
                            </CardContent>
                        </Card>
                        <Card className="border border-gray-200 shadow-none bg-white">
                            <CardContent className="p-4 text-center">
                                <TrendingUp className="w-8 h-8 text-purple-700 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-black">500+</p>
                                <p className="text-xs text-gray-500">Orders</p>
                            </CardContent>
                        </Card>
                        <Card className="border border-gray-200 shadow-none bg-white">
                            <CardContent className="p-4 text-center">
                                <Clock className="w-8 h-8 text-black mx-auto mb-2" />
                                <p className="text-2xl font-bold text-black">&lt;2h</p>
                                <p className="text-xs text-gray-500">Response</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search & Filter Bar */}
                    <Card className="border border-gray-200 shadow-none">
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Search */}
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent bg-white"
                                    />
                                </div>
                                
                                {/* Sort */}
                                <div className="flex gap-2">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700 bg-white"
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="rating">Top Rated</option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Products Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShoppingBag className="w-6 h-6 text-purple-700" />
                            <h2 className="text-2xl md:text-3xl font-bold text-black">Our Products</h2>
                        </div>
                        <Badge variant="secondary" className="text-sm px-3 py-1 bg-gray-100 text-black border-0">
                            {filteredProducts.length} items
                        </Badge>
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length === 0 ? (
                        <Alert className="border-2 border-dashed border-gray-300">
                            <Package className="h-5 w-5 text-purple-700" />
                            <AlertDescription className="text-center py-12">
                                <p className="text-xl font-semibold mb-2 text-black">
                                    {searchQuery ? 'No products found' : 'No products available yet'}
                                </p>
                                <p className="text-gray-500">
                                    {searchQuery ? 'Try adjusting your search' : 'Check back soon for new arrivals!'}
                                </p>
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                            {filteredProducts.map((product, index) => (
                                <Card 
                                    key={product.id} 
                                    className="overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-gray-200 shadow-none group bg-white cursor-pointer"
                                    style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.05}s both` }}
                                    onClick={() => viewProduct(product)}
                                >
                                    <div className="relative overflow-hidden h-64 bg-gray-100">
                                        <img 
                                            src={product.images[0]?.url} 
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />

                                        {/* Rating Badge */}
                                        <div className="absolute bottom-3 left-3">
                                            <Badge className="bg-white/95 backdrop-blur-sm text-black border-0 shadow-md">
                                                <Star className="w-3 h-3 mr-1 fill-purple-700 text-purple-700" />
                                                {product.rating}
                                            </Badge>
                                        </div>

                                        {/* Stock Badge */}
                                        {product.stock === "Limited Stock" && (
                                            <Badge className="absolute top-3 left-3 bg-black text-white border-0 shadow-md">
                                                Limited
                                            </Badge>
                                        )}
                                    </div>
                                    
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg font-bold text-black line-clamp-1 group-hover:text-purple-700 transition-colors">
                                            {product.name}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2 text-sm leading-relaxed text-gray-500">
                                            {product.description}
                                        </CardDescription>
                                    </CardHeader>
                                    
                                    <CardContent className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-purple-700" >
                                                {product.price}
                                            </span>
                                            <Button 
                                                size="icon"
                                                variant="ghost"
                                                className="hover:bg-gray-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    trackEvent({
                                                      businessId: business.id,
                                                      eventType: 'product_shared',
                                                      productId: product.id,
                                                  });
                                              
                                                    handleShare( product);
                                                }}
                                            >
                                                <Share2 className="w-4 h-4 text-gray-500" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                    
                                    <CardFooter className="pt-0">
                                        <Button 
                                            className="w-full bg-purple-700 hover:bg-purple-800 text-white shadow-none"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                viewProduct(product);
                                            }}
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Details
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Floating WhatsApp Button */}
                <div className="fixed bottom-6 right-6 z-50">
                    <div className="relative group">
                        <Button 
                            onClick={() => {
                              if (vendor?.whatsapp ) {
                                trackEvent({
                                    businessId: business.id,
                                    eventType: 'inquiry_sent',
                                });
                              }
                        
                              openWhatsApp(vendor!, null!)
                            }}
                            size="lg"
                            className="relative rounded-full shadow-lg bg-black hover:bg-gray-900 w-16 h-16 p-0 hover:scale-110 transition-all duration-300"
                            title="Chat on WhatsApp"
                        >
                            <MessageCircle className="w-7 h-7 text-white" />
                        </Button>
                    </div>
                </div>
            </div>




            <StorePageFooter vendor={vendor} />

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
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