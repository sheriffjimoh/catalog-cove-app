import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { MapPin, Phone, Mail, MessageCircle, Package, Share2, Star, Heart, ShoppingBag, TrendingUp, Award, Shield, Clock, Eye, Filter, Search, Store } from 'lucide-react';
import StorePageHeader from '@/Components/StorePageHeader';
import StorePageFooter from '@/Components/StorePageFooter';
interface image {
    id: number;
    url: string;
    is_processed: boolean;
}

interface product {
    id: number;
    name: string;
    price: string;
    description: string;
    rating: number;
    images: image[];
    stock: string;
    slug?: string;
}

interface vendor {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
    coordinates: string;
    short_note: string;
    slug: string;
    logo_url?: string;
}

const StoreListingPage = ({ business }: any) => {
    const [vendor, setVendor] = useState<vendor | null>(null);
    const [products, setProducts] = useState<product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<product[]>([]);
    const [loading, setLoading] = useState(true);
    const [fadeIn, setFadeIn] = useState(false);
    const [likedProducts, setLikedProducts] = useState(new Set<number>());
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('featured');

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

    const openMaps = () => {
        if (vendor?.coordinates) {
            window.open(`https://www.google.com/maps/search/?api=1&query=${vendor.coordinates}`, '_blank');
        }
    };

    const openWhatsApp = () => {
        if (vendor?.whatsapp) {
            window.open(`https://wa.me/${vendor.whatsapp}`, '_blank');
        }
    };

    const handleShare = async (product: product) => {
        const shareData = {
            title: product.name,
            text: `Check out ${product.name} - ${product.price}`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const toggleLike = (productId: number) => {
        setLikedProducts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    };

    const viewProduct = (product: product) => {
        // Navigate to product page - adjust this based on your routing
        window.location.href = `/store/${vendor?.slug}/product/${product.slug || product.id}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
                <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-pulse">
                    <div className="bg-white rounded-3xl shadow-xl p-8 h-72"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-white rounded-2xl h-96 shadow-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            <div className={`transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
                
                {/* Premium Store Header */}
                 <StorePageHeader vendor={vendor} />
                {/* Main Content */}
                <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
                    
                    {/* Store Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
                            <CardContent className="p-4 text-center">
                                <Package className="w-8 h-8 text-purple-700 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-purple-900">{products.length}</p>
                                <p className="text-xs text-purple-700">Products</p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
                            <CardContent className="p-4 text-center">
                                <Star className="w-8 h-8 text-blue-700 mx-auto mb-2 fill-blue-700" />
                                <p className="text-2xl font-bold text-blue-900">4.8</p>
                                <p className="text-xs text-blue-700">Rating</p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
                            <CardContent className="p-4 text-center">
                                <TrendingUp className="w-8 h-8 text-green-700 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-green-900">500+</p>
                                <p className="text-xs text-green-700">Orders</p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-md bg-gradient-to-br from-pink-50 to-pink-100">
                            <CardContent className="p-4 text-center">
                                <Clock className="w-8 h-8 text-pink-700 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-pink-900">&lt;2h</p>
                                <p className="text-xs text-pink-700">Response</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search & Filter Bar */}
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Search */}
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                
                                {/* Sort */}
                                <div className="flex gap-2">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Our Products</h2>
                        </div>
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                            {filteredProducts.length} items
                        </Badge>
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length === 0 ? (
                        <Alert className="border-2 border-dashed border-purple-200">
                            <Package className="h-5 w-5 text-purple-600" />
                            <AlertDescription className="text-center py-12">
                                <p className="text-xl font-semibold mb-2 text-slate-800">
                                    {searchQuery ? 'No products found' : 'No products available yet'}
                                </p>
                                <p className="text-slate-600">
                                    {searchQuery ? 'Try adjusting your search' : 'Check back soon for new arrivals!'}
                                </p>
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                            {filteredProducts.map((product, index) => (
                                <Card 
                                    key={product.id} 
                                    className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg group bg-white cursor-pointer"
                                    style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.05}s both` }}
                                    onClick={() => viewProduct(product)}
                                >
                                    <div className="relative overflow-hidden h-64 bg-gradient-to-br from-slate-100 to-slate-200">
                                        <img 
                                            src={product.images[0]?.url} 
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        
                                        {/* Like Button */}
                                        {/* <Button
                                            variant="secondary"
                                            size="icon"
                                            className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-transform shadow-lg z-10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleLike(product.id);
                                            }}
                                        >
                                            <Heart className={`w-4 h-4 transition-colors ${likedProducts.has(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
                                        </Button> */}

                                        {/* Rating Badge */}
                                        <div className="absolute bottom-3 left-3">
                                            <Badge className="bg-white/95 backdrop-blur-sm text-slate-800 border-0 shadow-md">
                                                <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                                                {product.rating}
                                            </Badge>
                                        </div>

                                        {/* Stock Badge */}
                                        {product.stock === "Limited Stock" && (
                                            <Badge className="absolute top-3 left-3 bg-orange-500 border-0 shadow-md">
                                                Limited
                                            </Badge>
                                        )}
                                    </div>
                                    
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-purple-700 transition-colors">
                                            {product.name}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                                            {product.description}
                                        </CardDescription>
                                    </CardHeader>
                                    
                                    <CardContent className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-purple-700 bg-clip-text" >
                                                {product.price}
                                            </span>
                                            <Button 
                                                size="icon"
                                                variant="ghost"
                                                className="hover:bg-purple-50"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShare(product);
                                                }}
                                            >
                                                <Share2 className="w-4 h-4 text-slate-600" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                    
                                    <CardFooter className="pt-0">
                                        <Button 
                                            className="w-full bg-purple-700 shadow-md group-hover:shadow-lg transition-all"
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
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse"></div>
                        <Button 
                            onClick={openWhatsApp}
                            size="lg"
                            className="relative rounded-full shadow-2xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 w-16 h-16 p-0 hover:scale-110 transition-all duration-300"
                            title="Chat on WhatsApp"
                        >
                            <MessageCircle className="w-7 h-7" />
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
    );
};

export default StoreListingPage;