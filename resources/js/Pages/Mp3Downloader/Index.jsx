import { useForm, usePage } from "@inertiajs/react";
import DownloadModal from "./Partials/DownloadModal.jsx";
import { useEffect, useRef } from "react";

export default function Mp3Downloader({ downloadHistory }) {
    const { data, setData, processing, errors, post } = useForm({ url: "" });
    const downloadAreaRef = useRef(null);
    const { Mp3Downloader = {} } = usePage().props;
    const isDownloadReady = !!Mp3Downloader?.download_url;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("mp3-downloader.store"), {
            preserveScroll: true,
        });
    };

    useEffect(() => {
        if (Mp3Downloader?.download_url && downloadAreaRef.current) {
            setTimeout(() => {
                downloadAreaRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 100);
        }
    }, [Mp3Downloader]);

    return (
        <div className="bg-white flex flex-col w-full max-w-3xl mx-auto rounded-2xl shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 overflow-hidden">
            <form onSubmit={handleSubmit}>
                <div className="bg-gray-50 flex flex-col w-full items-center py-8 px-6 border-b border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-yellow-200/40 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="flex items-center justify-center p-3 bg-yellow-100 rounded-full mb-3 z-10 shadow-inner border border-yellow-200/50">
                        <svg
                            className="w-6 h-6 text-yellow-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                            ></path>
                        </svg>
                    </div>

                    <h1 className="text-xl sm:text-2xl font-black tracking-widest text-gray-800 drop-shadow-sm uppercase text-center z-10">
                        <span className="text-yellow-600">MP3</span> DOWNLOADER
                    </h1>
                    <p className="text-sm text-gray-500 mt-2 text-center max-w-md z-10">
                        Konversi video YouTube favoritmu menjadi format audio
                        MP3 berkualitas tinggi secara instan.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 p-6 md:p-8 bg-white z-10">
                    <div className="relative grow">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                ></path>
                            </svg>
                        </div>
                        <input
                            value={data.url}
                            onChange={(e) => setData("url", e.target.value)}
                            placeholder="Paste URL video YouTube di sini..."
                            type="url"
                            required
                            className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500/40 focus:border-yellow-500 transition-all text-gray-700 placeholder-gray-400"
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                            <button
                                type="button"
                                onClick={() => setData("url", "")}
                                className="text-gray-400 hover:text-red-500 font-bold transition-colors focus:outline-none p-1 rounded-full hover:bg-red-50"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center justify-center gap-2 px-8 py-3.5 bg-linear-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : null}
                        <span className="tracking-wide">CONVERT</span>
                    </button>
                </div>
            </form>

            {processing && (
                <div className="flex flex-col gap-2 items-center w-full max-w-md mx-auto p-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 200 200"
                        className="w-20 h-20 text-amber-500 animate-spin"
                    >
                        <path
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="24"
                            d="m148 84.7 13.8-8-10-17.3-13.8 8a50 50 0 0 0-27.4-15.9v-16h-20v16A50 50 0 0 0 63 67.4l-13.8-8-10 17.3 13.8 8a50 50 0 0 0 0 31.7l-13.8 8 10 17.3 13.8-8a50 50 0 0 0 27.5 15.9v16h20v-16a50 50 0 0 0 27.4-15.9l13.8 8 10-17.3-13.8-8a50 50 0 0 0 0-31.7Zm-47.5 50.8a35 35 0 1 1 0-70 35 35 0 0 1 0 70Z"
                        />
                    </svg>
                    <h1 className="text-lg sm:text-xl text-center text-amber-500 font-extrabold tracking-wide px-2">
                        Please wait for a moment
                        <span className="animate-pulse">...</span>
                    </h1>
                </div>
            )}

            {!processing && isDownloadReady && (
                <div ref={downloadAreaRef}>
                    <DownloadModal
                        downloadedData={Mp3Downloader}
                        isProcessing={processing}
                    />
                </div>
            )}

            <hr className="w-1/2 mx-auto border-t-2 border-gray-500 my-10" />
            
            <div>
                <h1 className="text-lg sm:text-2xl font-black tracking-widest text-gray-800 drop-shadow-sm uppercase text-center z-10">
                    HISTORY
                </h1>

                <div className="flex grow flex-col gap-10 p-5 mb-10">
                    {!downloadHistory || downloadHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300 mx-6">
                            <svg
                                className="w-12 h-12 text-gray-300 mb-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                            <p className="text-gray-400 italic font-medium">
                                No History Yet
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 pb-12">
                            {downloadHistory.map((history) => {
                                const formattedDate = new Date(
                                    history.created_at,
                                ).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                });

                                return (
                                    <div
                                        key={history.id}
                                        className="flex flex-col bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                    >
                                        <div className="w-full aspect-video overflow-hidden relative bg-gray-100">
                                            <img
                                                src={history.download_thumbnail}
                                                alt={history.download_title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>

                                            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
                                                <span className="text-white text-xs font-black tracking-widest">
                                                    MP3
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col p-6 gap-4">
                                            <h2
                                                className="text-lg sm:text-xl text-gray-800 font-extrabold tracking-wide line-clamp-2 leading-snug"
                                                title={history.download_title}
                                            >
                                                {history.download_title}
                                            </h2>

                                            <a
                                                href={history.download_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-semibold text-blue-500 hover:text-blue-700 hover:underline transition-colors truncate"
                                                title={history.download_url}
                                            >
                                                {history.download_url}
                                            </a>

                                            <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-gray-400 bg-gray-50 self-start px-3 py-1.5 rounded-lg border border-gray-100">
                                                <svg
                                                    className="w-4 h-4 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    ></path>
                                                </svg>
                                                <span>{formattedDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}