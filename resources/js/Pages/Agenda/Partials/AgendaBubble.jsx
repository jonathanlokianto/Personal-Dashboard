import { Link, progress, router } from "@inertiajs/react";
import AgendaProgressBar from "./AgendaProgressBar";
import lockLogo from "../../../../assets/images/lock.png";
import unlockLogo from "../../../../assets/images/unlock.png";

// const AgendaProgressBar = ({ currentProgress, onProgressChange }) => {
//     const steps = [0, 25, 50, 75, 100];

//     return (
//         <div className="flex gap-1 h-3 w-full">
//             {steps.map((step) => (
//                 <button
//                     key={step}
//                     onClick={() => onProgressChange(step)}
//                     className={`transition-all flex grow rounded duration-300 ${
//                         currentProgress >= step
//                             ? "bg-blue-500 hover:bg-blue-600"
//                             : "bg-gray-500 hover:bg-gray-600"
//                     }`}
//                     title={`Set Progress to ${step}`}
//                 />
//             ))}
//         </div>
//     );
// };

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
                // onStart: () => console.log("Request dimulai..."),
                // onSuccess: () => console.log("Berhasil diupdate!"),
                // onError: (err) => console.log("Error nih:", err),
            },
        );
    };

    return (
        <div className="w-full">
            <div className="bg-[#455a73] relative flex flex-col p-4 md:p-5 text-white rounded-xl shadow-sm border border-[#3b4d63] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
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
                                ? "bg-red-500/20 border-red-500/50 hover:bg-red-500/40" 
                                : "bg-white/10 border-white/10 hover:bg-white/20"
                        }`}
                        title={agenda.isSuspended ? "Unlock Agenda" : "Suspend Agenda"}
                    >
                        <img 
                            src={agenda.isSuspended ? lockLogo : unlockLogo} 
                            alt="Status Icon" 
                            className="w-4 h-4 opacity-90" 
                        />
                    </button>
                </div>

                <div
                    className={`flex flex-col grow transition-all duration-300 ${
                        agenda.isSuspended ? "opacity-50 grayscale-[30%] pointer-events-none" : ""
                    }`}
                >
                    <div className="mb-3 pr-10">
                        <h1 className="text-lg font-bold tracking-wide text-white leading-snug">
                            {agenda.content}
                        </h1>
                        {agenda.note && (
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
                                {agenda.note}
                            </p>
                        )}
                    </div>

                    {/* Area Progress / Completed (Padding box & margin diperkecil) */}
                    <div className="mb-4">
                        {agenda.progress >= 100 ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-md">
                                <span className="text-green-400 font-bold text-xs">
                                    ✅ Completed at{" "}
                                    {new Date(agenda.completed_at).toLocaleDateString("id-ID", {
                                        day: 'numeric', month: 'short', year: 'numeric'
                                    })}
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 bg-black/20 p-3 rounded-lg border border-white/5">
                                <div className="flex justify-between items-end">
                                    <h4 className="text-xs font-semibold text-slate-300">
                                        Current Progress
                                    </h4>
                                    <span className="text-xs font-bold text-blue-300">
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

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-auto pt-3 border-t border-white/10">
                        
                        <div className="flex flex-wrap gap-1.5">
                            {agenda.tags?.map((tag) => (
                                <span 
                                    key={tag.id}
                                    className="px-2 py-0.5 text-[11px] font-medium text-slate-200 bg-white/10 border border-white/10 rounded backdrop-blur-sm"
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
                                className="flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-sm transition-all duration-200"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md shadow-sm transition-all duration-200"
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