import { Award, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/Components/ui/badge";

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
}

export default function StorePageHeader({ vendor }: StorePageHeaderProps) {
    const openWhatsApp = () => {
        if (vendor?.whatsapp) {
            window.open(`https://wa.me/${vendor.whatsapp}`, "_blank");
        }
    };

    const openMaps = () => {
        if (vendor?.coordinates) {
            window.open(
                `https://www.google.com/maps/search/?api=1&query=${vendor.coordinates}`,
                "_blank"
            );
        }
    };

    const hasCover = !!vendor?.cover_image;

    return (
        <>
            {/* Hero Banner */}
            <div className="relative w-full overflow-hidden">
                {/* Background */}
                {hasCover ? (
                    <div className="absolute inset-0">
                        <img
                            src={vendor.cover_image!}
                            alt={`${vendor?.name} cover`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-purple-700 to-purple-900">
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }} />
                    </div>
                )}

                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <div className="bg-white rounded-2xl p-2 shadow-xl border border-white/20">
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
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-sm">
                                    {vendor?.name}
                                </h1>
                                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
                                    <Award className="w-3 h-3 mr-1" />
                                    Verified
                                </Badge>
                            </div>

                            {vendor?.tagline && (
                                <p className="text-white/90 text-lg md:text-xl font-medium mb-2">
                                    {vendor.tagline}
                                </p>
                            )}

                            {vendor?.short_note && !vendor?.tagline && (
                                <p className="text-white/80 text-sm md:text-base mb-3 line-clamp-2 max-w-2xl">
                                    {vendor.short_note}
                                </p>
                            )}

                            {vendor?.tagline && vendor?.short_note && (
                                <p className="text-white/70 text-sm mb-3 line-clamp-2 max-w-2xl">
                                    {vendor.short_note}
                                </p>
                            )}

                            {/* Contact chips */}
                            <div className="flex flex-wrap gap-2 mt-3">
                                {vendor?.address && (
                                    <span className="inline-flex items-center gap-1.5 text-sm text-white/80 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span className="line-clamp-1 max-w-[200px]">{vendor.address}</span>
                                    </span>
                                )}
                                {vendor?.whatsapp && (
                                    <span className="inline-flex items-center gap-1.5 text-sm text-white/80 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                                        <Phone className="w-3.5 h-3.5" />
                                        {vendor.whatsapp}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 w-full md:w-auto flex-shrink-0">
                            {vendor?.coordinates && (
                                <Button
                                    onClick={openMaps}
                                    variant="outline"
                                    className="flex-1 md:flex-initial bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white"
                                >
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Location
                                </Button>
                            )}
                            <Button
                                onClick={openWhatsApp}
                                className="flex-1 md:flex-initial bg-white text-purple-700 hover:bg-white/90 font-semibold"
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Contact
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Minimal Sticky Nav (appears on scroll) */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-lg bg-white/95">
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
                            <span className="font-semibold text-black text-sm md:text-base">
                                {vendor?.name}
                            </span>
                            <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">
                                <Award className="w-3 h-3 mr-1" />
                                Verified
                            </Badge>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={openWhatsApp}
                                size="sm"
                                className="bg-purple-700 hover:bg-purple-800 text-white text-xs"
                            >
                                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                                Contact
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
