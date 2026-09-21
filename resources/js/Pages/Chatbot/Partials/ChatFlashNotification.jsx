export default function ErrorNotification({ message, onClose }) {
    const msg = message ?? "Error Message";

    return (
        <div id="chatNotification" className="w-full pointer-events-auto">
            <div className="flex items-start w-full p-4 gap-3 bg-red-50 border border-red-200 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                
                <div className="flex-shrink-0 pt-0.5">
                    <svg
                        className="w-6 h-6 text-red-500"
                        viewBox="0 0 64 64"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4.544"
                    >
                        <g strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="32" cy="32" r="24"></circle>
                            <line x1="32" y1="16" x2="32" y2="36"></line>
                            <line x1="32" y1="44" x2="32" y2="48"></line>
                        </g>
                    </svg>
                </div>

                <div className="flex-1 text-sm font-medium text-red-800 break-words leading-relaxed pt-0.5">
                    {msg}
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="flex-shrink-0 inline-flex items-center justify-center p-1.5 text-red-400 bg-transparent rounded-lg hover:text-red-600 hover:bg-red-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
            </div>
        </div>
    );
}