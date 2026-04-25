import { useState, useRef, useCallback } from 'react';
import { Settings, Tag, BarChart3, ImagePlus, ExternalLink, X, Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface StoreAdminToolbarProps {
    businessId: number;
    businessSlug: string;
    onBannerUpdate?: (url: string) => void;
}

export default function StoreAdminToolbar({ businessId, businessSlug, onBannerUpdate }: StoreAdminToolbarProps) {
    const [showBannerUpload, setShowBannerUpload] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Instant preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setUploadStatus('idle');

        // Upload via fetch (not Inertia) for seamless experience
        setUploading(true);

        const formData = new FormData();
        formData.append('cover_image', file);

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        fetch('/business/update-banner', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
            },
            body: formData,
        })
            .then(res => res.json())
            .then(data => {
                setUploading(false);
                if (data.success) {
                    setUploadStatus('success');
                    // Update the parent component's banner
                    if (onBannerUpdate) {
                        onBannerUpdate(data.cover_image);
                    }
                    // Auto-close after 1.5s
                    setTimeout(() => {
                        setShowBannerUpload(false);
                        setPreview(null);
                        setUploadStatus('idle');
                    }, 1500);
                } else {
                    setUploadStatus('error');
                }
            })
            .catch(() => {
                setUploading(false);
                setUploadStatus('error');
            });
    }, [onBannerUpdate]);

    const closeModal = () => {
        setShowBannerUpload(false);
        setPreview(null);
        setUploadStatus('idle');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-[100] bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between h-12">
                        {/* Left — Label */}
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-xs font-medium text-gray-300">
                                Admin Mode
                            </span>
                        </div>

                        {/* Center — Actions */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setShowBannerUpload(true)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <ImagePlus size={14} />
                                <span className="hidden sm:inline">Upload Banner</span>
                            </button>
                            <a
                                href="/categories"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <Tag size={14} />
                                <span className="hidden sm:inline">Categories</span>
                            </a>
                            <a
                                href="/settings/business-information"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <Settings size={14} />
                                <span className="hidden sm:inline">Edit Store</span>
                            </a>
                            <a
                                href="/analytics"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <BarChart3 size={14} />
                                <span className="hidden sm:inline">Analytics</span>
                            </a>
                        </div>

                        {/* Right — Dashboard link */}
                        <a
                            href="/dashboard"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-900/30 rounded-lg transition-colors"
                        >
                            <ExternalLink size={14} />
                            <span className="hidden sm:inline">Dashboard</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Banner Upload Modal */}
            {showBannerUpload && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Upload Store Banner
                            </h3>
                            <button
                                onClick={closeModal}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Preview Area */}
                        <div className="px-6 py-4">
                            {preview ? (
                                <div className="relative rounded-xl overflow-hidden">
                                    <img
                                        src={preview}
                                        alt="Banner preview"
                                        className="w-full h-48 object-cover"
                                    />
                                    {/* Overlay preview */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />

                                    {/* Upload status overlay */}
                                    {uploading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                            <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-xl shadow-lg">
                                                <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                                                <span className="text-sm font-medium text-gray-700">Uploading...</span>
                                            </div>
                                        </div>
                                    )}
                                    {uploadStatus === 'success' && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                            <div className="flex items-center gap-2 bg-green-50 px-5 py-3 rounded-xl shadow-lg">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                <span className="text-sm font-medium text-green-700">Banner updated!</span>
                                            </div>
                                        </div>
                                    )}
                                    {uploadStatus === 'error' && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                            <div className="flex items-center gap-2 bg-red-50 px-5 py-3 rounded-xl shadow-lg">
                                                <AlertCircle className="w-5 h-5 text-red-600" />
                                                <span className="text-sm font-medium text-red-700">Upload failed. Try again.</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        Choose an image for your store banner. Recommended size: 1400×500px.
                                    </p>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full flex flex-col items-center justify-center gap-3 px-4 py-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50/50 transition-all cursor-pointer"
                                    >
                                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                                            <Upload size={24} className="text-gray-400" />
                                        </div>
                                        <div className="text-center">
                                            <span className="text-sm font-medium block">Click to choose an image</span>
                                            <span className="text-xs text-gray-400 mt-1 block">PNG, JPG, WEBP up to 5MB</span>
                                        </div>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Footer — change image or close */}
                        {preview && uploadStatus !== 'success' && (
                            <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => {
                                        setPreview(null);
                                        setUploadStatus('idle');
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    disabled={uploading}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                                >
                                    Choose different image
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
