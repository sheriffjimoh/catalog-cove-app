import React, { useState } from 'react';
import { Image, Zap, Trash2, Download, Calendar, Package, ChevronDown, ChevronUp, Search } from 'lucide-react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useSonner } from '@/Hooks/useSonner';

// Types
interface ProductImage {
  id: string;
  url: string;
  is_processed: boolean;
  updatedAt: Date;
  createdAt: Date;
}

interface Product {
  created_at: string;
  id: string;
  name: string;
  createdAt: Date;
  images: ProductImage[];
}


export default function MediaManager({ productswithImages }: { productswithImages: Product[] }) {


  const [products, setProducts] = useState<Product[]>(productswithImages);
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set(['1']));
  const [processingImages, setProcessingImages] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const { customSonner } = useSonner();

  const toggleProduct = (productId: string) => {
    setExpandedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };


  const removeBackground = async (productId: string, imageId: string) => {
    setProcessingImages(prev => new Set(prev).add(imageId));
    
    router.post(
      route('image.remove-bg'),
      { image_id: imageId },
      {
        preserveState: false, // Reload page data to get updated image
        onFinish: () => {
          setProcessingImages(prev => {
            const newSet = new Set(prev);
            newSet.delete(imageId);
            return newSet;
          });
        }
      }
    );
  };


  const deleteImage = (productId: string, imageId: string) => {

      router.delete(route('image.delete', imageId), {
              preserveScroll: true,
              onSuccess: (page) => {
               
                const success = (page.props?.flash as { success?: boolean })?.success;
                const error = (page.props?.flash as { error?: boolean })?.error;
                if(error) {
                    return;
                }
                if (!success) {
                    return;
                 }
                  setProducts(prev => prev.map(product => {
                  if (product.id === productId) {
                    return {
                      ...product,
                      images: product.images.filter(img => img.id !== imageId)
                    };
                  }
                  return product;
                }));
              },
              onError: (errors) => {
                console.error(errors);
                alert("Failed to delete image. Try again.");
              },
            });
  };

    const downloadImage = (url: string, filename: string) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
    };

    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


  console.log("Rendering MediaManager with products:", productswithImages);
  return (
    <Authenticated>
      <Head title="Media Manager" />
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-600 rounded-xl shadow-lg">
              <Image className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Media Manager</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Manage and optimize your product images
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Products</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {products.length}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Package className="text-indigo-600 dark:text-indigo-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Images</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {products.reduce((sum, p) => sum + p.images.length, 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Image className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Processed</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  {products.reduce((sum, p) => sum + p.images.filter(img => img.is_processed).length, 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Zap className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {filteredProducts.map((product) => {
            const isExpanded = expandedProducts.has(product.id);
            
            return (
              <div
                key={product.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                
                {/* Product Header */}
                <button
                  onClick={() => toggleProduct(product.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <Package className="text-indigo-600 dark:text-indigo-400" size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {product.created_at.split('T')[0]}
                        </span>
                        <span className="flex items-center gap-1">
                          <Image size={14} />
                          {product.images.length} images
                        </span>
                      </div>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {/* Images Grid */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-slate-200 dark:border-slate-700 pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {product.images.map((image) => {
                        const isProcessing = processingImages.has(image.id);
                        console.log("Image Processing State:", image.id, isProcessing, image);
                        return (
                          <div
                            key={image.id}
                            className="group relative aspect-square bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden"
                          >
                            <img
                              src={image.url}
                              alt="Product"
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Status Badge */}
                            {image.is_processed && (
                              <div className="absolute top-2 left-2">
                                <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-md flex items-center gap-1">
                                  <Zap size={10} />
                                  Processed
                                </span>
                              </div>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                              {!image.is_processed && !isProcessing && (
                                <button
                                  onClick={() => removeBackground(product.id, image.id)}
                                  className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                                  title="Remove Background"
                                >
                                  <Zap size={18} />
                                </button>
                              )}
                              
                              {isProcessing && (
                                <div className="flex flex-col items-center gap-2 text-white">
                                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-xs">Processing...</span>
                                </div>
                              )}
                              
                              <button
                                onClick={() => downloadImage(image.url, `${product.name}-${image.id}.jpg`)}
                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                title="Download"
                              >
                                <Download size={18} />
                              </button>
                              
                              <button
                                onClick={() => 
                                  customSonner({ type: 'info', text: 'Are you sure you want to delete this image?',
                                    actionLabel: 'Yes', actionOnClick: () =>  deleteImage(product.id, image.id)
                                   })
                                  }
                                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                <Image className="text-slate-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Try adjusting your search query
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </Authenticated>
  );
}