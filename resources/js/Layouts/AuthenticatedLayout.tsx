import { usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import Sidebar from "@/Components/Sidebar";
import Topbar from "@/Components/Topbar";

export default function Authenticated({
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const onLogout = () => {
        // Implement logout functionality here
        console.log("Logout function called");
    };

    const pageProps = usePage().props;
    const flash = pageProps.flash as { success?: string; error?: string };

    useEffect(() => {
        if (flash.success) {
            alert(flash.success);
        }

        if (flash.error) {
            alert(flash.error);
        }
    }, [flash]);

    return (
        <div className="min-h-screen ">
            <div className="min-h-screen dark:black flex">
                <Sidebar
                    isOpen={showingNavigationDropdown}
                    onClose={() => setShowingNavigationDropdown(false)}
                />

                {/* Main content */}
                <div className="flex-1 flex flex-col min-w-0">
                    <Topbar
                        onMenuClick={() => setShowingNavigationDropdown(true)}
                        onLogout={onLogout}
                    />

                    {/* Content area */}
                    <main className="p-6  bg-white dark:bg-gray-900 h-full">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
