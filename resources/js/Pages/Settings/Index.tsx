import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import SettingsSidebar from "@/Components/SettingsSidebar";
import { Outlet } from "react-router-dom";

export default function SettingsPagesLayout({
    children,
}: { children: React.ReactNode }) {
    return (
        <Authenticated>
            <Head title="Settings" />

            <main className="w-full xl:px-[48px] px-3 pb-6 xl:pb-[48px] sm:pt-[15px] ">
                <div className="grid grid-cols-1 xl:grid-cols-12 dark:bg-gray-800 bg-slate-50 rounded-lg shadow ">
                    <SettingsSidebar />
                    <div className="py-8 px-10 col-span-9 tab-content">
                    <Outlet />
                    {children}
                    </div>
                </div>
            </main>
        </Authenticated>
    );
}
