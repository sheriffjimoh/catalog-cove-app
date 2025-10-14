import React from "react";
import { X } from "lucide-react";
import type { SidebarProps } from "@/Types/nav.type";
import { Link, usePage } from "@inertiajs/react";
import { navigationItems } from "@/Lib/constant";

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const user = usePage().props.auth.user;
    const business = usePage().props.business as { name: string } | null;
    const userRole: "business" | "admin" = user.role;
    const businessName: string = business ? business?.name : "My Business";
    const filteredNavigation = navigationItems.filter((item) =>
        item.roles.includes(userRole)
    );

    return (
        <>
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r  border-gray-200 dark:border-gray-800  shadow-lg transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 lg:static lg:inset-0`}
            >
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800">
                    <Link href="/" className="flex items-center space-x-3">
                        <img
                            src="/images/logo.svg"
                            alt="Logo"
                            className="h-20  w-60"
                        />
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="mt-8 px-4">
                    {filteredNavigation.map((item) => {
                        const Icon = item.icon;
                        const { url } = usePage();
                        const isActive = url.startsWith(item.href); // Check if current URL starts with item href

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors duration-200 group ${
                                    isActive
                                        ? "bg-purple-700 text-white"
                                        : "text-gray-700 dark:text-white hover:bg-purple-700 hover:text-white"
                                }`}
                            >
                                <Icon className="h-5 w-5 mr-3" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Role Badge */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div
                        className={`px-3 py-2 rounded-lg text-sm font-medium text-center ${
                            userRole === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                        }`}
                    >
                        {userRole.charAt(0).toUpperCase() + userRole.slice(1)}{" "}
                        Role
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={onClose}
                />
            )}
        </>
    );
};

export default Sidebar;
