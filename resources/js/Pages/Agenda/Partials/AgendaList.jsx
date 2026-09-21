import AgendaBubble from "./AgendaBubble";
import AgendaPagination from "../../../Components/Pagination";

export default function AgendaList({ agendas, onEditClick }) {
    const maxPerPage = 3;

    return (
        <div className="flex flex-col w-full h-full">
            <div className="bg-white flex flex-col grow rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 bg-slate-50/80 border-b border-slate-200 backdrop-blur-sm">
                    <h1 className="text-xl font-bold tracking-wider text-slate-800">
                        AGENDA LIST
                    </h1>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-full text-xs font-bold">
                        {agendas.data?.length || 0} Items
                    </span>
                </div>

                <div className="p-6 md:p-8 grow">
                    {agendas.data && agendas.data.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {agendas.data.map((item) => (
                                <AgendaBubble
                                    key={item.id}
                                    agenda={item}
                                    onEditClick={onEditClick}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full min-h-[300px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 m-4">
                            <div className="p-4 bg-slate-100 rounded-full mb-3">
                                <span className="text-3xl">📭</span>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700">
                                Your agenda is Empty
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Add new agenda to start tracking your to-do list.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {agendas.links && agendas.links.length > 3 && (
                <div className="mt-6 flex justify-center">
                    <AgendaPagination links={agendas.links} />
                </div>
            )}
        </div>
    );
}