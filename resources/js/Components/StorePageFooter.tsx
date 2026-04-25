import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

export default function StorePageFooter({ vendor }: { vendor: any }) {
    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* About */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                            About
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {vendor?.short_note || `Welcome to ${vendor?.name}`}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
                                    All Products
                                </a>
                            </li>
                            {vendor?.whatsapp && (
                                <li>
                                    <button
                                        onClick={() => window.open(`https://wa.me/${vendor.whatsapp}`, "_blank")}
                                        className="text-gray-500 hover:text-gray-900 transition-colors text-sm inline-flex items-center gap-1.5"
                                    >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        Contact Us
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                            Contact
                        </h3>
                        <ul className="space-y-2.5">
                            {vendor?.address && (
                                <li className="flex items-start gap-2 text-gray-500 text-sm">
                                    <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                    <span>{vendor.address}</span>
                                </li>
                            )}
                            {vendor?.whatsapp && (
                                <li className="flex items-center gap-2 text-gray-500 text-sm">
                                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>{vendor.whatsapp}</span>
                                </li>
                            )}
                            {vendor?.email && (
                                <li className="flex items-center gap-2 text-gray-500 text-sm">
                                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>{vendor.email}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-gray-400 text-xs">
                        © {new Date().getFullYear()} {vendor?.name}
                    </p>
                    <a
                        href="https://catalogcove.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        Powered by
                        <span className="font-semibold">CatalogCove</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
