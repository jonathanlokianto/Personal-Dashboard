import { useEffect, useState } from "react";
import TagBubble from "./TagBubble";
import TagCreate from "./TagCreate";

export default function TagList({ availableTags, onCancel }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);

    const handleOpenTagEditor = (tag = null) => {
        setSelectedTag(tag);
        setIsModalOpen(true);
    };

    useEffect(() => {
        if (isModalOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        return () => document.body.classList.remove("overflow-hidden");
    }, [isModalOpen]);

    const handleExitTagCreator = () => {
        setIsModalOpen(false);
        setSelectedTag(null);
    };

    return (
        <div className="flex flex-col w-full h-full relative">
            <div
                className={`bg-white flex flex-col grow rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 
                ${isModalOpen ? "opacity-50 pointer-events-none scale-[0.98]" : "scale-100"}`}
            >
                <div className="flex justify-center items-center p-6 bg-gray-50 border-b border-gray-100">
                    <h1 className="text-xl font-extrabold tracking-widest text-gray-800 uppercase">
                        TAG LIST
                    </h1>
                </div>

                <div className="p-6 md:p-8 flex flex-col grow">
                    
                    <div className="flex flex-wrap w-full gap-4 items-center min-h-[5rem]">
                        {availableTags?.length > 0 ? (
                            availableTags.map((tag) => (
                                <TagBubble
                                    key={tag.id}
                                    tag={tag}
                                    onToggle={() => handleOpenTagEditor(tag)}
                                />
                            ))
                        ) : (
                            <div className="flex items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-lg px-6 py-2.5 h-10">
                                <span className="text-sm font-semibold tracking-wide text-gray-400">
                                    TAG LIST IS EMPTY
                                </span>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => handleOpenTagEditor(null)}
                            className="flex items-center justify-center w-10 h-10 rounded-lg text-blue-600 bg-blue-50 border border-blue-200 
                                       hover:bg-blue-600 hover:text-white hover:shadow-md hover:scale-105 
                                       transition-all duration-300 cursor-pointer shrink-0"
                            title="Create New Tag"
                        >
                            <span className="font-bold text-xl leading-none">
                                +
                            </span>
                        </button>
                    </div>

                    <div className="flex justify-center items-center mt-auto pt-12 pb-2">
                        <button
                            type="button"
                            onClick={() => onCancel()}
                            className="px-8 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 
                                       rounded-lg shadow-sm hover:bg-gray-100 transition-all duration-200"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
                    <TagCreate
                        tagData={selectedTag}
                        onExit={handleExitTagCreator}
                    />
                </div>
            )}
        </div>
    );
}