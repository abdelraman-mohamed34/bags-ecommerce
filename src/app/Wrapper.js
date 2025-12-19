"use client";
import { store } from "./store";
import { Provider } from "react-redux";
import { usePathname } from "next/navigation";
import Header from "@/_components/Header";
import AuthProvider from "@/AuthProvider";
import NotificationPortal from "./GlobalNotification";
import Footer from "@/_components/Footer";

export default function Wrapper({ children }) {
    const pathname = usePathname();
    const noSidebarPaths = ["/login"];


    return (
        <Provider store={store}>
            <AuthProvider>
                <div className="flex-grow w-full pt-[72.99px]">
                    <Header />
                    {children}
                    <NotificationPortal />
                    <Footer />
                </div>
            </AuthProvider>
        </Provider>
    );
}