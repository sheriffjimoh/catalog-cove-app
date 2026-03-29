import {
    Award,
    Clock,
    Mail,
    MapPin,
    MessageCircle,
    Package,
    Phone,
    Shield,
} from "lucide-react";

export default function StorePageFooter({ vendor }: { vendor: any }) {
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
     
<footer className="bg-white border-t border-gray-200 mt-20">
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            
            {/* About Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-black">
                    About {vendor?.name}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                    {vendor?.short_note}
                </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-black">
                    Quick Links
                </h3>
                <ul className="space-y-2">
                    <li>
                        <a href="#" className="text-gray-500 hover:text-purple-700 transition-colors text-sm flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            All Products
                        </a>
                    </li>
                    <li>
                        <button onClick={openWhatsApp} className="text-gray-500 hover:text-purple-700 transition-colors text-sm flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Contact Us
                        </button>
                    </li>
                    <li>
                        <button onClick={openMaps} className="text-gray-500 hover:text-purple-700 transition-colors text-sm flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Visit Store
                        </button>
                    </li>
                </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-black">
                    Contact
                </h3>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 mt-1 text-purple-700 flex-shrink-0" />
                        <span>{vendor?.address}</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-500 text-sm">
                        <Phone className="w-4 h-4 text-purple-700 flex-shrink-0" />
                        <span>{vendor?.whatsapp}</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-500 text-sm">
                        <Mail className="w-4 h-4 text-purple-700 flex-shrink-0" />
                        <span>{vendor?.email}</span>
                    </li>
                </ul>
            </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Platform Signature */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
                <p className="text-gray-500 text-sm">
                    © {new Date().getFullYear()} {vendor?.name}. All rights reserved.
                </p>
            </div>
            
            <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm">Powered by</span>
                <a 
                    href="https://catalogcove.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-4 py-2 bg-white border-2 border-purple-700 rounded-full hover:bg-purple-700 transition-all hover:scale-105"
                >
                    <img 
                       src="/images/logo-icon.png"
                        alt="CatalogCove" 
                        className="w-8 h-8 object-contain"
                    />
                    <span className="font-bold text-purple-700 group-hover:text-white transition-colors">
                        CatalogCove
                    </span>
                </a>
            </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-6 mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Shield className="w-4 h-4 text-purple-700" />
                <span>Secure Platform</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Award className="w-4 h-4 text-purple-700" />
                <span>Verified Seller</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Clock className="w-4 h-4 text-purple-700" />
                <span>24/7 Support</span>
            </div>
        </div>
    </div>
</footer>
    );
}
