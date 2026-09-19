export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-gradient-to-r from-slate-900 to-gray-800 min-h-[5rem] flex flex-col sm:flex-row items-center justify-between px-6 sm:px-12 text-slate-300 py-4 sm:py-0 relative overflow-hidden mt-auto border-t border-white/5 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.3)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

            <div className="flex flex-col items-center sm:items-start gap-1 mb-3 sm:mb-0 z-10">
                <h1 className="text-sm sm:text-base font-bold tracking-widest drop-shadow-sm">
                    <span className="text-blue-400">PERSONAL</span> DASHBOARD
                </h1>
                <span className="text-[11px] text-slate-500 font-medium tracking-wider">
                    &copy; {currentYear} ALL RIGHTS RESERVED
                </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-bold text-slate-400 z-10">
                <span className="hover:text-blue-300 transition-colors cursor-default tracking-widest uppercase">
                    Built with Laravel & React
                </span>
                <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
                <span className="hover:text-blue-300 transition-colors cursor-pointer tracking-widest uppercase flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    System V1.0
                </span>
            </div>
        </footer>
    );
}