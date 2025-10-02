import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Camera, X, Sparkles, Image, Plus, ArrowLeft, Save, Zap, Upload, Eye } from "lucide-react";
import type {  ImageUpload, FormData, AILoadingState, AIActionType, ModernCreateProps } from "@/Types/create-product.type";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";


export default function ModernCreate() {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    description: "",
    price: "",
    stock: 0,
    images: [] as File[], // Explicitly define the type of images as File[]
  });

  const [images, setImages] = useState<ImageUpload[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<AILoadingState>({
    title: false,
    description: false,
    background: null
  });
  const [imageVersion, setImageVersion] = useState(0);

  const MAX_IMAGES = 6;
  const MAX_DESCRIPTION_LENGTH = 500;

  const handleImageUpload = (files: FileList | null): void => {
    if (!files) return;

    const newImages: ImageUpload[] = Array.from(files)
      .slice(0, MAX_IMAGES - images.length)
      .map((file: File) => ({
        id:`${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        name: file.name, 
        lastUpdated: new Date(),
      }));
    
    const updatedImages: ImageUpload[] = [...images, ...newImages];
    setImages(updatedImages);
    setData("images", updatedImages.map((img: ImageUpload) => img.file).filter((file): file is File => file !== null));
  };

  const removeImage = (id: string): void => {
    const updatedImages: ImageUpload[] = images.filter((img: ImageUpload) => img.id !== id.toString());
    setImages(updatedImages);
    setData("images", updatedImages.map((img: ImageUpload) => img.file).filter((file): file is File => file !== null));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files?.length) handleImageUpload(files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragActive(false);
  };

 
  useEffect(() => {
    console.log("Images updated in UI:", images);
  }, [images]);


  const handleAISuggestion = async (
    type: AIActionType,
    imageId: string | null = null
  ): Promise<void> => {
    try {
      // Mark correct loading state
      setAiLoading((prev) => ({
        ...prev,
        [type]: type === "background" ? imageId ?? true : true,
      }));

      // Pick the image (for now always first if not specified)
      const selectedImage = imageId
        ? images.find((img) => img.id === imageId.toString())
        : images[0];
  
      if (!selectedImage) {
        throw new Error("No image found for AI suggestion");
      }
  
      // Build request
      const formData = new FormData();
      formData.append("type", type);

      if(selectedImage.file === null) {
        formData.append("image", selectedImage.preview);
        }else{
        formData.append("image", selectedImage.file);
      }

      formData.append(
        "_token",
        (
          document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement
        )?.content || ""
      );
  
      const res = await fetch(route("ai.suggestion"), {
        method: "POST",
        body: formData,
      });
  
      if (!res.ok) {
        throw new Error(`Failed to generate AI ${type} suggestion`);
      }
  
      const data = await res.json();
  
      if (!data.success) {
        throw new Error(data.error || `AI ${type} suggestion failed`);
      }
  
      // Apply suggestion or replace image
      if (type === "title") {
        setData("name", data.suggestion);
      } else if (type === "description") {
        setData("description", data.suggestion);
      } else if (type === "background") {
        // Replace the image URL in the images state
       
        // setImages((prev) => {
        //   const updated = prev.map((img) => {
        //     const matches = String(img.id) === String(imageId);
        //     console.log(`Comparing ${img.id} === ${imageId}: ${matches}`);
            
        //     return matches
        //       ? {
        //           ...img,
        //           preview: `${data.processed_url}?cache=${Date.now()}`,
        //           file: null,
        //           lastUpdated: new Date(),
        //         }
        //       : img;
        //   });
           
        //   return updated;
        // });

        const updatedImages = images.map((img) =>
          String(img.id) === String(imageId)
            ? {
                ...img,
                preview: `${data.processed_url}?t=${Date.now()}`,
                file: null,
                lastUpdated: new Date(),
              }
            : img
        );
        
        // setIsRefreshing(true);
        setImages([]);
        
        setTimeout(() => {
          setImages(updatedImages);
          setData('images', updatedImages.map((img) => img.file).filter((file): file is File => file !== null));
          // setIsRefreshing(false);
        }, 50);

        // console.log("Looking for imageId:", imageId, "type:", typeof imageId);
        // console.log("Updated Images after background removal:", images);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "AI request failed");
    } finally {
      // Reset loading
      setAiLoading((prev) => ({
        ...prev,
        [type]: type === "background" ? null : false,
      }));
    }
  };
  
  

  const handleInputChange = (field: keyof FormData) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      const value = e.target.value;
      
      if (field === 'stock') {
        const numValue = parseInt(value) || 0;
        setData(field, numValue);
      } else if (field === 'description' && value.length > MAX_DESCRIPTION_LENGTH) {
        return; // Don't update if exceeds max length
      } else {
        setData(field, value);
      }
    };
  };

  const submit = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();

    console.log("Submitting form with data:", data);
    post("/products");
  };

  const goBack = (): void => {
    window.history.back();
  };

  const isFormValid = (): boolean => {
    return Boolean(data.name.trim() && data.description.trim() && data.price && data.stock >= 0);
  };

  return (
    <Authenticated>
    <Head title="Create Product" />
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={goBack}
            type="button"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors mb-6 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Products</span>
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-700 rounded-xl shadow-lg">
                <Plus className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create Product</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Add your product and let AI optimize the details</p>
              </div>
            </div>
            
            {/* AI Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="text-indigo-600 dark:text-indigo-400" size={16} />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">AI-Powered</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Sidebar - Images */}
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                  <Camera size={22} className="text-indigo-600 dark:text-indigo-400" />
                  Product Images
                  <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                    ({images.length}/{MAX_IMAGES})
                  </span>
                </h3>
              </div>
              
              <div className="p-6">
                {/* Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    dragActive 
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-105' 
                      : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageUpload(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={images.length >= MAX_IMAGES}
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                      <Upload className="text-indigo-600 dark:text-indigo-400" size={24} />
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-slate-200 font-medium">
                        {images.length >= MAX_IMAGES ? "Maximum images reached" : "Upload Product Images"}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Drag & drop or click to browse • PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image Grid */}
                {images.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Uploaded Images</h4>
                    <div  className="grid grid-cols-2 gap-3">
                      {images.map((image: ImageUpload, index: number) => (
                        <div  key={`${image.id}-${image.lastUpdated?.getTime() || 0}`}  className="relative group bg-slate-50 dark:bg-slate-700 rounded-lg overflow-hidden">
                          <img
                          src={`${image.preview}`}
                            alt={`Product ${index + 1}`}
                            className="w-full h-24 sm:h-32 object-cover"
                            loading="eager"
                            crossOrigin="anonymous"
                          />
                          {/* Image Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => removeImage(image.id)}
                                className="p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                                aria-label={`Remove image ${index + 1}`}
                              >
                                <X size={14} />
                              </button>
                            </div>
                            
                            {/* AI Background Removal */}
                            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleAISuggestion('background', image.id)}
                                disabled={aiLoading.background === image.id}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-2 rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                              >
                                {aiLoading.background === image.id ? (
                                  <>
                                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <Zap size={12} />
                                    Remove Background
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                          
                          {/* Primary Badge */}
                          {index === 0 && (
                            <div className="absolute top-2 left-2">
                              <span className="px-2 py-1 bg-indigo-600 text-white text-xs font-medium rounded-md">
                                Primary
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {errors.images && (
                  <p className="text-red-500 text-sm mt-2">{errors.images}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Content - Form */}
          <div className="xl:col-span-8 space-y-6">
            
            {/* Product Details Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Product Information</h3>
              </div>
              
              <div className="p-6 space-y-6">
                
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Product Name *
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={data.name}
                        onChange={handleInputChange('name')}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                        placeholder="Enter a compelling product name..."
                        required
                        maxLength={100}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAISuggestion('title')}
                      disabled={aiLoading.title}
                      className="px-5 py-3 bg-purple-700 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap shadow-md hover:shadow-lg"
                    >
                      {aiLoading.title ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Thinking...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          AI Suggest
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Product Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Product Description *
                  </label>
                  <div className="space-y-3">
                    <div className="relative">
                      <textarea
                        value={data.description}
                        onChange={handleInputChange('description')}
                        rows={7}
                        className="w-full px-4 py-3 border resize-y  border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                        placeholder="Describe what makes your product special..."
                        required
                        maxLength={MAX_DESCRIPTION_LENGTH}
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                        {data.description.length}/{MAX_DESCRIPTION_LENGTH}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAISuggestion('description')}
                      disabled={aiLoading.description}
                      className="w-full sm:w-auto px-5 py-3 bg-purple-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      {aiLoading.description ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Writing description...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          Generate with AI
                        </>
                      )}
                    </button>
                  </div>
                  {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
                </div>

                {/* Price and Stock Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      Price *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-500 dark:text-slate-400 text-lg">$</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.price}
                        onChange={handleInputChange('price')}
                        className="w-full pl-8 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    {errors.price && <p className="text-red-500 text-sm mt-2">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={data.stock}
                      onChange={handleInputChange('stock')}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                      placeholder="Available units"
                      required
                    />
                    {errors.stock && <p className="text-red-500 text-sm mt-2">{errors.stock}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Features Highlight */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800/50 p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                  <Sparkles className="text-indigo-600 dark:text-indigo-400" size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">AI-Powered Optimization</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                    Let our AI help you create compelling product listings that convert better and save you time.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Smart title generation
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Description writing
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Background removal
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {typeof errors === 'object' && 'error' in errors && (
        <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
          {typeof errors.error === 'string' ? errors.error : ''}
        </div>
      )}
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-end pt-6">
      
              <button
                type="button"
                onClick={goBack}
                className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={processing || !isFormValid()}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Product...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Create Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Authenticated>
  );
}