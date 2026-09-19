export default function Header() {
    return (
        <header className="w-full bg-gradient-to-r from-blue-700 to-indigo-800 h-20 shadow-lg flex items-center justify-between px-6 sm:px-12 text-white relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center gap-4 z-10">
                <div className="flex items-center justify-center bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/20 shadow-inner group transition-all duration-300 hover:scale-105 hover:bg-white/20 cursor-default">
                    <svg
                        className="w-7 h-7 text-blue-100 group-hover:text-white transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"
                        />
                    </svg>
                </div>
                
                <h1 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-md">
                    <span className="text-blue-200">PERSONAL</span> DASHBOARD
                </h1>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-xs sm:text-sm font-medium text-blue-100/90 z-10 bg-black/15 px-4 py-2 rounded-full border border-black/10 backdrop-blur-sm shadow-inner cursor-default">
                <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                System Active
            </div>
        </header>
    );
}