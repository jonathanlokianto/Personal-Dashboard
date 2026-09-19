import AgendaBubble from "./AgendaBubble";
import AgendaPagination from "../../../Components/Pagination";

export default function AgendaList({ agendas, onEditClick }) {
    const maxPerPage = 3;

    return (
        <div className="flex flex-col w-full h-full">
            <div className="bg-white flex flex-col grow rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                
                {/* Header */}
                <div className="flex justify-center items-center p-6 bg-gray-50 border-b border-gray-100">
                    <h1 className="text-xl font-extrabold tracking-widest text-gray-800">
                        AGENDA LIST
                    </h1>
                </div>

                {/* Body / Content */}
                <div className="p-6 md:p-8 flex-grow">
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
                        <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
                            <h1 className="text-lg font-semibold tracking-wide text-gray-400">
                                AGENDA IS EMPTY
                            </h1>
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {agendas.links && agendas.links.length > 3 && (
                <div className="mt-6 flex justify-center">
                    <AgendaPagination links={agendas.links} />
                </div>
            )}
        </div>
    );
}