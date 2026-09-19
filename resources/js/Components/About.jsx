export default function About() {
    return (
        <section className="bg-gradient-to-b from-transparent to-slate-50 border-t border-slate-200 py-16 mt-auto">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-block">
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                About The App
                            </span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
                            Exploring Modern <span className="text-blue-600">SaaS Architecture</span>
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                            <strong>Personal Dashboard</strong> is designed as a full-stack web application utilizing a <strong>Single Page Application (SPA)</strong> architecture. This project is an in-depth exploration of efficiently managing end-to-end data flow and interface integration.
                        </p>
                        <p className="text-md text-slate-500 leading-relaxed max-w-2xl">
                            Combining the robustness of a scalable backend with a highly reactive frontend to deliver a fast, seamless, and centralized user experience within a single ecosystem.
                        </p>
                        
                        <div className="flex flex-wrap gap-3 pt-4">
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-200 shadow-sm">
                                Laravel
                            </span>
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-sm">
                                React.js
                            </span>
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200 shadow-sm">
                                Inertia.js
                            </span>
                        </div>
                    </div>

                    <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 lg:pt-0">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                            <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-2xl mb-4">
                                📅
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Agenda Manager</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Daily time and activity management with a dynamic and intuitive interface.
                            </p>
                        </div>
                        
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 sm:-mt-8">
                            <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-2xl mb-4">
                                🤖
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">AI Chatbot</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Smart assistant integration designed to help you accomplish tasks and find information efficiently.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                            <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-2xl mb-4">
                                🎵
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Music Downloader</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                An integrated extra utility for searching and downloading high-quality audio seamlessly.
                            </p>
                        </div>

                        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-col justify-center items-start sm:-mt-8 hover:bg-slate-800 transition-colors duration-300">
                            <div className="h-12 w-12 bg-slate-800 text-blue-400 rounded-xl flex items-center justify-center text-2xl mb-4 border border-slate-700">
                                🚀
                            </div>
                            <h3 className="font-bold text-white mb-2">SaaS Architecture</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Engineered for high performance, maximum scalability, and an elevated user experience.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}