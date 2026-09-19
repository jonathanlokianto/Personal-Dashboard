import { Link, usePage, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

// const getLinkClass = (path) => {
//     const isActive = url === path;
//     return `rounded-md px-3 py-2 text-sm font-medium ${
//         isActive
//             ? "bg-blue-900 text-white"
//             : "text-gray-300 hover:bg-white/5 hover:text-white"
//     }`;
// };

const NavLink = ({ href, children, active }) => {
    return (
        <Link
            href={href}
            className={`rounded-md px-3 py-2 text-sm font-medium ${
                active
                    ? "bg-blue-900 text-white"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`}
        >
            {children}
        </Link>
    );
};

export default function Navbar() {
    const { url } = usePage();
    const [isOpen, setIsOpen] = useState(false);
    const dropDownRef = useRef(null);
    useEffect (()=>{
        const handleOutsideClick = (e) => {
            if (dropDownRef.current && !dropDownRef.current.contains(e.target)){

                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return ()=>{
            document.removeEventListener("mousedown", handleOutsideClick);
        }
    }, []);

    return (
        <>
            <nav className="relative bg-blue-800">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">

                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex shrink-0 items-center">
                                <img
                                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                                    alt="Your Company"
                                    className="h-8 w-auto"
                                />
                            </div>

                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    <NavLink
                                        href={route("agenda.index")}
                                        active={url === "/agenda"}
                                    >
                                        Agenda
                                    </NavLink>
                                    <NavLink
                                        href={route("chatbot.index")}
                                        active={url === "/chatbot"}
                                    >
                                        Chatbot
                                    </NavLink>
                                    <NavLink
                                        href="/mp3-downloader"
                                        active={url === "/mp3-downloader"}
                                    >
                                        MP3 Downloader
                                    </NavLink>
                                </div>
                            </div>
                        </div>{" "}

                    </div>
                </div>
            </nav>
        </>
    );
}
