import { Link, progress, router } from "@inertiajs/react";
import AgendaProgressBar from "./AgendaProgressBar";
import lockLogo from "../../../../assets/images/lock.png";
import unlockLogo from "../../../../assets/images/unlock.png";

export default function AgendaBubble({ agenda, onEditClick }) {
    const handleEdit = () => {
        onEditClick(agenda);
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this agenda?")) {
            router.delete(route("agenda.destroy", agenda.id), {
                preserveScroll: true,
            });
        }
    };

    const handleProgressClick = (step) => {
        router.put(
            route("agenda.update", agenda),
            { progress: step },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <div className="w-full">
            <div className="relative flex flex-col p-5 text-slate-800 rounded-xl bg-white border border-slate-200 transition-all duration-300 hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 group">
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={() => {
                            router.put(
                                route("agenda.update", agenda.id),
                                { isSuspended: !agenda.isSuspended },
                                {
                                    preserveScroll: true,
                                },
                            );
                        }}
                        className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${
                            agenda.isSuspended 
                                ? "bg-red-50 border-red-200 hover:bg-red-100" 
                                : "bg-slate-100 border-slate-200 hover:bg-slate-200"
                        }`}
                        title={agenda.isSuspended ? "Unlock Agenda" : "Suspend Agenda"}
                    >
                        <img 
                            src={agenda.isSuspended ? lockLogo : unlockLogo} 
                            alt="Status Icon" 
                            className="w-4 h-4 opacity-70" 
                        />
                    </button>
                </div>

                <div
                    className={`flex flex-col grow transition-all duration-300 ${
                        agenda.isSuspended ? "opacity-50 grayscale-[30%] pointer-events-none" : ""
                    }`}
                >
                    <div className="mb-3 pr-10">
                        <h1 className="text-lg font-bold tracking-wide text-slate-800 leading-snug">
                            {agenda.content}
                        </h1>
                        {agenda.note && (
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                                {agenda.note}
                            </p>
                        )}
                    </div>

                    {/* Area Progress / Completed */}
                    <div className="mb-4">
                        {agenda.progress >= 100 ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-md">
                                <span className="text-emerald-700 font-bold text-xs">
                                    ✅ Completed at{" "}
                                    {new Date(agenda.completed_at).toLocaleDateString("id-ID", {
                                        day: 'numeric', month: 'short', year: 'numeric'
                                    })}
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <div className="flex justify-between items-end">
                                    <h4 className="text-xs font-semibold text-slate-600">
                                        Current Progress
                                    </h4>
                                    <span className="text-xs font-bold text-blue-600">
                                        {agenda.progress}%
                                    </span>
                                </div>
                                <AgendaProgressBar
                                    currentProgress={agenda.progress}
                                    onProgressChange={handleProgressClick}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-auto pt-3 border-t border-slate-100">
                        <div className="flex flex-wrap gap-1.5">
                            {agenda.tags?.map((tag) => (
                                <span 
                                    key={tag.id}
                                    className="px-2 py-0.5 text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded"
                                >
                                    #{tag.tag_name}
                                </span>
                            ))}
                            {(!agenda.tags || agenda.tags.length === 0) && (
                                <span className="text-[11px] text-slate-400 italic">No tags</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={handleEdit}
                                className="flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-all duration-200"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-all duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}