export default function DownloadModal({ downloadedData }) {
    return (
        <div>
            <hr className="w-1/2 mx-auto border-t-2 border-gray-500 my-10" />
            <h1
                className="flex items-center justify-center gap-3 sm:gap-4
                text-l sm:text-2xl font-black tracking-wider  
                text-gray-800 drop-shadow-sm uppercase    
                text-center z-10"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                    className="w-5 h-5 sm:w-7 sm:h-7 animate-bounce"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
                    />
                </svg>

                <span>YOUR DOWNLOAD IS HERE</span>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                    className="w-5 h-5 sm:w-7 sm:h-7 animate-bounce"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
                    />
                </svg>
            </h1>


            <div className="flex flex-col gap-6 items-center w-full max-w-md mx-auto p-4">
                <div
                    className="w-full rounded-xl overflow-hidden aspect-video
                                shadow-lg border border-gray-100 relative group"
                >
                    <img
                        src={downloadedData.download_thumbnail}
                        alt={downloadedData.download_title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 relative"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                </div>

                <h1
                    className="text-lg sm:text-xl text-center
                            text-amber-500 
                            font-extrabold 
                            tracking-wide 
                            line-clamp-2 
                            px-2"
                >
                    Title: {downloadedData.download_title}.mp3
                </h1>
                <a
                    href={downloadedData.download_url}
                    download={`${downloadedData.download_title}.mp3`}
                    className="flex items-center justify-center gap-3 px-8 py-3.5 w-full sm:w-auto
                                bg-linear-to-r from-blue-500 to-blue-700 
                                hover:from-blue-600 hover:to-blue-800 
                                text-white font-bold tracking-wider
                                rounded-xl shadow-md shadow-blue-500/30
                                transition-all duration-300 active:scale-95"
                >
                    <svg
                        className="w-5 h-5 animate-bounce"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        ></path>
                    </svg>
                    DOWNLOAD
                </a>
            </div>
        </div>
    );
}
