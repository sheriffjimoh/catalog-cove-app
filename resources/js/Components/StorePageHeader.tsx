import { Award, MapPin, MessageCircle, Phone } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/Components/ui/badge";

export default function StorePageHeader({ vendor }: { vendor: any }) {
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

    return (
        <div className="bg-white border-b border-purple-100 sticky top-0 z-40 backdrop-blur-lg bg-white/95 shadow-sm">
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                    {/* Logo & Info */}
                    <div className="flex gap-4 items-start flex-1">
                        <div className="relative group flex-shrink-0">
                            <div className="absolute inset-0  rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                            <div className="relative bg-white rounded-2xl p-3 shadow-lg border border-purple-100">
                                <img
                                    src={
                                        vendor?.logo ||
                                        "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=200&h=200&fit=crop"
                                    }
                                    alt={vendor?.name}
                                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h1 className="text-2xl md:text-3xl font-bold text-purple-700 bg-clip-text ">
                                    {vendor?.name}
                                </h1>
                                <Badge className="bg-purple-100 text-purple-700 border-0">
                                    <Award className="w-3 h-3 mr-1" />
                                    Verified
                                </Badge>
                            </div>
                            <p className="text-slate-600 text-sm md:text-base mb-3 line-clamp-2">
                                {vendor?.short_note}
                            </p>

                            {/* Quick Contact Info */}
                            <div className="flex flex-wrap gap-3 text-sm">
                                <div className="flex items-center gap-1.5 text-slate-600">
                                    <MapPin className="w-4 h-4 text-purple-600" />
                                    <span className="line-clamp-1">
                                        {vendor?.address}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-600">
                                    <Phone className="w-4 h-4 text-green-600" />
                                    <span>{vendor?.whatsapp}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 w-full lg:w-auto">
                        <Button
                            onClick={openMaps}
                            variant="outline"
                            className="flex-1 lg:flex-initial hover:bg-purple-50 hover:border-purple-300"
                        >
                            <MapPin className="w-4 h-4 mr-2" />
                            Location
                        </Button>
                        <Button
                            onClick={openWhatsApp}
                            className="flex-1 lg:flex-initial bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Contact
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
