import Navbar from "../Components/Navbar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { usePage } from "@inertiajs/react";
import { useState } from "react";
import FlashNotification from "../Components/FlashNotification";
import About from '../Components/About';

export default function MainLayout({ children }) {
    return (
        <>
            <div className="flex flex-col min-h-[130vh]">
                <Header />
                <Navbar />
                <main className="bg-white flex grow flex-col py-8">
                    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 min-w-[320px] flex flex-col grow">
                            <FlashNotification />
                        <div className="bg-gray-200 rounded-xl p-6 sm:p-10 shadow-inner flex grow">
                            {children}
                        </div>
                    </div>
                </main>
                <About />
                <Footer />
            </div>
        </>
    );
}