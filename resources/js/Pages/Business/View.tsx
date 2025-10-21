import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, 
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
     AlertDialogTitle } from '@/Components/ui/alert-dialog';
import { MapPin, Phone, Mail, MessageCircle, Package, Share2, X, ChevronLeft, ChevronRight } from 'lucide-react';



interface product {
  id: number;
  name: string;
  price: string;
  description: string;
  rating: number;
  images: string[];
  stock: string;
}

interface vendor {
    id: number;
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
    coordinates: string;
    }
// Dummy data
const dummyVendor = {
  id: 1,
  name: "Premium Electronics Store",
  description: "Your trusted partner for high-quality electronics and gadgets. We pride ourselves on excellent customer service and authentic products.",
  address: "123 Tech Boulevard, Silicon Valley, CA 94025",
  phone: "+1 (555) 123-4567",
  email: "contact@premiumelectronics.com",
  whatsapp: "+15551234567",
  coordinates: "37.4419,-122.1430"
};

const dummyProducts = [
  {
    id: 1,
    name: "Wireless Earbuds Pro",
    price: "$129.99",
    description: "Premium sound quality with active noise cancellation",
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=400&h=400&fit=crop"
    ],
    stock: "In Stock"
  },
  {
    id: 2,
    name: "Smart Watch Ultra",
    price: "$399.99",
    description: "Advanced fitness tracking with heart rate monitor",
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1523395243481-163f8f6155ab?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop"
    ],
    stock: "In Stock"
  },
  {
    id: 3,
    name: "Portable Bluetooth Speaker",
    price: "$79.99",
    description: "360° sound with 20-hour battery life",
    rating: 4.3,
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop"
    ],
    stock: "Limited Stock"
  },
  {
    id: 4,
    name: "Wireless Charging Pad",
    price: "$49.99",
    description: "Fast charging for all Qi-enabled devices",
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1591290619762-9642d1b488c4?w=400&h=400&fit=crop"
    ],
    stock: "In Stock"
  }
];

const VendorDetailsPage = () => {
  const [vendor, setVendor] = useState<vendor | null>(null);
  const [products, setProducts] = useState<product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setVendor(dummyVendor);
      setProducts(dummyProducts);
      setLoading(false);
      setFadeIn(true);
    }, 800);
  }, []);

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

  const nextImage = () => {
    if (selectedProduct) {
      setCurrentImageIndex((prev) => 
        prev === selectedProduct.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProduct) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProduct.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 h-48"></CardHeader>
            <CardContent className="p-8">
              <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-slate-200"></div>
                <CardContent className="p-4">
                  <div className="h-6 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className={`max-w-7xl mx-auto p-4 md:p-8 space-y-8 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        {/* Vendor Info Card */}
        <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 border-0">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-32 md:h-40"></div>
          <CardHeader className="pt-8 pb-4 px-6 md:px-8">
            <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {vendor?.name}
            </CardTitle>
            <CardDescription className="text-base md:text-lg mt-2 text-slate-600">
              {vendor?.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 md:px-8 pb-6">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3 text-slate-700">
                <MapPin className="w-5 h-5 mt-1 text-blue-600 flex-shrink-0" />
                <span className="text-sm">{vendor?.address}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm">{vendor?.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Mail className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm">{vendor?.email}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={openMaps} variant="outline" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                View on Map
              </Button>
              <Button onClick={openWhatsApp} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Available Products</h2>
            <Badge variant="secondary" className="ml-auto">{products.length} items</Badge>
          </div>

          {products.length === 0 ? (
            <Alert className="border-2 border-dashed">
              <Package className="h-4 w-4" />
              <AlertDescription className="text-center py-8">
                <p className="text-lg font-semibold mb-2">No products available yet</p>
                <p className="text-slate-600">Check back soon for new arrivals!</p>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg group"
                  style={{ 
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both` 
                  }}
                >
                  <div className="relative overflow-hidden h-56 bg-slate-100">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.stock === "Limited Stock" && (
                      <Badge className="absolute top-3 right-3 bg-orange-500">Limited</Badge>
                    )}
                    <Badge className="absolute top-3 left-3 bg-blue-600">
                      ⭐ {product.rating}
                    </Badge>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-slate-800 line-clamp-1">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {product.price}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0 flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        setSelectedProduct(product);
                        setCurrentImageIndex(0);
                      }}
                    >
                      View Product
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleShare(product)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sticky Contact Button (Mobile) */}
        <div className="fixed bottom-6 right-6 md:hidden z-50">
          <Button 
            onClick={openWhatsApp}
            size="lg"
            className="rounded-full shadow-2xl bg-green-600 hover:bg-green-700 w-16 h-16 p-0"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Product Preview Modal */}
      <AlertDialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl flex items-center justify-between pr-8">
              {selectedProduct?.name}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4 mt-4">
                {/* Image Gallery */}
                <div className="relative bg-slate-100 rounded-lg overflow-hidden">
                  <img 
                    src={selectedProduct?.images[currentImageIndex]} 
                    alt={selectedProduct?.name}
                    className="w-full h-96 object-cover"
                  />
                  {selectedProduct && selectedProduct.images.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                        onClick={nextImage}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {selectedProduct?.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                {selectedProduct && selectedProduct.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedProduct.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === currentImageIndex ? 'border-blue-600 scale-105' : 'border-slate-200'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Product Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-blue-600">{selectedProduct?.price}</p>
                    <Badge variant={selectedProduct?.stock === "In Stock" ? "default" : "secondary"}>
                      {selectedProduct?.stock}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <span className="text-lg font-semibold">{selectedProduct?.rating} / 5.0</span>
                  </div>
                  <p className="text-slate-700 text-base leading-relaxed">
                    {selectedProduct?.description}
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <Button 
              variant="outline"
              onClick={() => selectedProduct && handleShare(selectedProduct)}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={openWhatsApp}>
              Contact vendor?
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
  );
};

export default VendorDetailsPage;