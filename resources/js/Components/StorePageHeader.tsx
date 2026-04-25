import { useState, useEffect } from "react";
import { MapPin, MessageCircle, Phone } from "lucide-react";

interface StorePageHeaderProps {
    vendor: {
        name?: string;
        logo?: string;
        cover_image?: string;
        tagline?: string;
        short_note?: string;
        address?: string;
        whatsapp?: string;
        coordinates?: string;
    } | null;
    coverImage?: string | null;
}

export default function StorePageHeader({ vendor, coverImage }: StorePageHeaderProps) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 300);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const openWhatsApp = () => {
        if (vendor?.whatsapp) {
            window.open(`https://wa.me/${vendor.whatsapp}`, "_blank");
        }
    };

    const activeCover = coverImage || vendor?.cover_image;
    const hasCover = !!activeCover;

    return (
        <>
            {/* Hero Banner */}
            <div className="relative w-full overflow-hidden" style={{ minHeight: '340px' }}>
                {/* Background */}
                {hasCover ? (
                    <div className="absolute inset-0">
                        <img
                            src={activeCover!}
                            alt={`${vendor?.name} cover`}
                            className="w-full h-full object-cover scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                        {/* Subtle dot pattern */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{
                            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                            backgroundSize: '24px 24px'
                        }} />
                        {/* Accent glow */}
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
                    </div>
                )}

                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <div className="bg-white rounded-2xl p-1.5 shadow-2xl ring-1 ring-white/20">
                                <img
                                    src={
                                        vendor?.logo ||
                                        "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=200&h=200&fit=crop"
                                    }
                                    alt={vendor?.name}
                                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2">
                                {vendor?.name}
                            </h1>

                            {vendor?.tagline && (
                                <p className="text-white/80 text-lg md:text-xl font-light mb-3 max-w-2xl">
                                    {vendor.tagline}
                                </p>
                            )}

                            {vendor?.short_note && !vendor?.tagline && (
                                <p className="text-white/60 text-sm md:text-base mb-4 line-clamp-2 max-w-2xl font-light">
                                    {vendor.short_note}
                                </p>
                            )}

                            {vendor?.tagline && vendor?.short_note && (
                                <p className="text-white/50 text-sm mb-4 line-clamp-2 max-w-2xl">
                                    {vendor.short_note}
                                </p>
                            )}

                            {/* Contact chips */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {vendor?.address && (
                                    <span className="inline-flex items-center gap-1.5 text-xs text-white/70 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 ring-1 ring-white/10">
                                        <MapPin className="w-3 h-3" />
                                        <span className="line-clamp-1 max-w-[180px]">{vendor.address}</span>
                                    </span>
                                )}
                                {vendor?.whatsapp && (
                                    <span className="inline-flex items-center gap-1.5 text-xs text-white/70 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 ring-1 ring-white/10">
                                        <Phone className="w-3 h-3" />
                                        {vendor.whatsapp}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 w-full md:w-auto flex-shrink-0">
                            <button
                                onClick={openWhatsApp}
                                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 hover:bg-gray-50 rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Contact
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Minimal Sticky Nav */}
            {/* <div className={`sticky top-0 z-40 transition-all duration-300 ${
                scrolled 
                    ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100' 
                    : 'bg-white border-b border-gray-100'
            }`}>
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src={
                                    vendor?.logo ||
                                    "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=200&h=200&fit=crop"
                                }
                                alt={vendor?.name}
                                className="w-8 h-8 object-cover rounded-lg"
                            />
                            <span className="font-semibold text-gray-900 text-sm">
                                {vendor?.name}
                            </span>
                        </div>
                        <button
                            onClick={openWhatsApp}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-medium rounded-full transition-colors"
                        >
                            <MessageCircle className="w-3 h-3" />
                            Contact
                        </button>
                    </div>
                </div>
            </div> */}
        </>
    );
}
