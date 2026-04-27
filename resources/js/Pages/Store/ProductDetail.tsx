import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    Share2,
    Star,
    Heart,
    ChevronLeft,
    ChevronRight,
    Award,
    Shield,
    ArrowLeft,
    Truck,
    Home,
} from "lucide-react";
import StorePageHeader from "@/Components/StorePageHeader";
import StorePageFooter from "@/Components/StorePageFooter";
import type { vendor, product } from "@/Types";
import { openWhatsApp, handleShare, formatPrice } from "@/Lib/utils";
import { useAnalytics, usePageViewTracking } from '@/Hooks/useAnalytics';
import { Head } from "@inertiajs/react";



const ProductDetailsPage = ({ business, product: initialProduct }: any) => {
    const [vendor, setVendor] = useState<vendor | null>(null);
    const [product, setProduct] = useState<product | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [fadeIn, setFadeIn] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    usePageViewTracking(business.id, 'product_viewed', initialProduct?.id);
    const { trackEvent } = useAnalytics();

    useEffect(() => {
        setTimeout(() => {
            setVendor(business);
            setProduct(initialProduct);
            setLoading(false);
            setFadeIn(true);
        }, 400);
    }, [business, initialProduct]);

    const nextImage = () => {
        if (product && product.images.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === product.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (product && product.images.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? product.images.length - 1 : prev - 1
            );
        }
    };

    const goBack = () => {
        window.history.back();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-pulse">
                    <div className="h-20 bg-white rounded-2xl"></div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="h-96 bg-white rounded-2xl"></div>
                        <div className="space-y-4">
                            <div className="h-8 bg-white rounded w-3/4"></div>
                            <div className="h-6 bg-white rounded w-1/2"></div>
                            <div className="h-32 bg-white rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
        <Head title={`${product?.name} - ${vendor?.name}`}>
            <meta name="description" content={product?.description?.substring(0, 155) || `${product?.name} from ${vendor?.name}`} />
            <meta property="og:title" content={`${product?.name} - ${vendor?.name}`} />
            <meta property="og:description" content={product?.description?.substring(0, 155) || `Shop ${product?.name}`} />
            {product?.images?.[0]?.url && <meta property="og:image" content={product.images[0].url} />}
            <meta property="og:type" content="product" />
        </Head>
        <div className="min-h-screen bg-gray-50">
            <div
                className={`transition-opacity duration-1000 ${
                    fadeIn ? "opacity-100" : "opacity-0"
                }`}
            >
                {/* Sticky Vendor Header */}
                <StorePageHeader vendor={vendor} />
                {/* Main Content */}
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 mb-6 text-sm">
                        <button
                            onClick={goBack}
                            className="flex items-center gap-1 text-slate-600 hover:text-purple-700 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Store
                        </button>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-600">{product?.name}</span>
                    </div>

                    {/* Product Details Grid */}
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Image Gallery Section */}
                        <div className="space-y-4">
                            <Card className="border-0 shadow-xl overflow-hidden bg-white">
                                <CardContent className="p-0">
                                    <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 aspect-square">
                                        <img
                                            src={
                                                product?.images[
                                                    currentImageIndex
                                                ]?.url
                                            }
                                            alt={product?.name}
                                            className="w-full h-full object-contain p-8 cursor-zoom-in"
                                            onClick={() =>
                                                setSelectedImage(
                                                    product?.images[
                                                        currentImageIndex
                                                    ]?.url || null
                                                )
                                            }
                                        />

                                        {/* Like Button */}
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="absolute top-4 right-4 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-transform shadow-lg"
                                            onClick={() => setIsLiked(!isLiked)}
                                        >
                                            <Heart
                                                className={`w-5 h-5 ${
                                                    isLiked
                                                        ? "fill-red-500 text-red-500"
                                                        : "text-slate-600"
                                                }`}
                                            />
                                        </Button>

                                        {/* Navigation Arrows */}
                                        {product &&
                                            product.images.length > 1 && (
                                                <>
                                                    <Button
                                                        variant="secondary"
                                                        size="icon"
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg bg-white/90 hover:bg-white"
                                                        onClick={prevImage}
                                                    >
                                                        <ChevronLeft className="w-5 h-5" />
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="icon"
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg bg-white/90 hover:bg-white"
                                                        onClick={nextImage}
                                                    >
                                                        <ChevronRight className="w-5 h-5" />
                                                    </Button>
                                                </>
                                            )}

                                        {/* Image Counter */}
                                        {product &&
                                            product.images.length > 1 && (
                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                                    {currentImageIndex + 1} /{" "}
                                                    {product.images.length}
                                                </div>
                                            )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Thumbnail Gallery */}
                            {product && product.images.length > 1 && (
                                <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() =>
                                                setCurrentImageIndex(idx)
                                            }
                                            className={`aspect-square rounded-xl overflow-hidden border-3 transition-all hover:scale-105 ${
                                                idx === currentImageIndex
                                                    ? "border-purple-700 ring-2 ring-purple-700 ring-offset-2 shadow-lg"
                                                    : "border-slate-200 hover:border-purple-300"
                                            }`}
                                        >
                                            <img
                                                src={img.url}
                                                alt=""
                                                className="w-full h-full object-cover bg-slate-100 p-2"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info Section */}
                        <div className="space-y-6">
                            {/* Product Header */}
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                                    {product?.name}
                                </h2>

                                {/* Rating & Reviews */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${
                                                        i <
                                                        Math.floor(
                                                            product?.rating || 0
                                                        )
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "text-slate-300"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="font-bold text-slate-800">
                                            {product?.rating}
                                        </span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="flex items-baseline gap-3 mb-6">
                                    <span className="text-4xl md:text-5xl font-bold text-purple-700">
                                        {formatPrice(product?.price, (business as any)?.country?.code || 'US')}
                                    </span>
                                    <Badge
                                        className={`${
                                            product?.stock === "In Stock"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-orange-100 text-orange-700"
                                        } border-0`}
                                    >
                                        {product?.stock}
                                    </Badge>
                                </div>
                            </div>

                            {/* Description */}
                            <Card className="border border-purple-100 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg text-purple-700">
                                        Product Description
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-700 leading-relaxed">
                                        {product?.description}
                                    </p>
                                </CardContent>
                            </Card>


                            <div className="grid grid-cols-3 gap-4 py-4">
                                <div className="text-center">
                                    <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-full flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-purple-700" />
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        Secure Payment
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                                        <Truck className="w-6 h-6 text-green-700" />
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        Fast Delivery
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Award className="w-6 h-6 text-blue-700" />
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        Verified Seller
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 pt-4">
                                <Button
                                    onClick={() =>{

                                        trackEvent({
                                            businessId: business.id,
                                            eventType: 'inquiry_sent',
                                            productId: product?.id,
                                        });

                                        openWhatsApp(vendor!, product!)
                                    }}
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all text-lg py-6"
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                    Contact Seller on WhatsApp
                                </Button>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        onClick={() => {
                                            trackEvent({
                                                businessId: business.id,
                                                eventType: 'product_shared',
                                                productId: product?.id,
                                            });
                                        
                                            handleShare(product!)
                                        }}
                                        variant="outline"
                                        size="lg"
                                        className="hover:bg-purple-50 hover:border-purple-300"
                                    >
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                    </Button>
                                    <Button
                                        onClick={goBack}
                                        variant="outline"
                                        size="lg"
                                        className="hover:bg-purple-50 hover:border-purple-300"
                                    >
                                        <Home className="w-4 h-4 mr-2" />
                                        Back to Store
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating WhatsApp Button */}
                <div className="fixed bottom-6 right-6 z-50">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse"></div>
                        <Button
                            onClick={() => openWhatsApp(vendor!, product!)}
                            size="lg"
                            className="relative rounded-full shadow-2xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 w-16 h-16 p-0 hover:scale-110 transition-all duration-300"
                            title="Chat on WhatsApp"
                        >
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                        </Button>
                    </div>
                </div>

                {/* Image Lightbox */}
                {selectedImage && (
                    <div
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <span className="text-4xl">&times;</span>
                        </button>
                        <img
                            src={selectedImage}
                            alt="Product"
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                )}
            </div>

            <StorePageFooter vendor={vendor} />
        </div>
        </>
    );
};

export default ProductDetailsPage;
