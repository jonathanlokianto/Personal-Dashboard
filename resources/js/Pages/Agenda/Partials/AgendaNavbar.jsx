import { useEffect, useRef, useState } from "react";

export default function AgendaNavbar({ onSearch, searchFilters, tagList = [] }) {
    const [include, setInclude] = useState(searchFilters?.include || "");
    const [exclude, setExclude] = useState(searchFilters?.exclude || "");
    const [search, setSearch] = useState(searchFilters?.search || "");

    const [isIncludeSuggestionOpen, setIsIncludeSuggestionOpen] = useState(false);
    const [isExcludeSuggestionOpen, setIsExcludeSuggestionOpen] = useState(false);

    const initialRender = useRef(true);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const delaySearch = setTimeout(() => {
            onSearch?.({ filters: { include, exclude, search } });
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [include, exclude, search]);

    const handlePreventSubmit = (e) => e.preventDefault();

    const filteredIncludeTags = tagList.filter((tag) =>
        tag.tag_name.toLowerCase().includes(include.toLowerCase())
    );
    const filteredExcludeTags = tagList.filter((tag) =>
        tag.tag_name.toLowerCase().includes(exclude.toLowerCase())
    );

    return (
        <form
            onSubmit={handlePreventSubmit}
            className="flex flex-col md:flex-row md:items-end gap-5 bg-white p-6 w-full rounded-2xl shadow-sm border border-slate-200 mb-6"
        >
            {/* INCLUDE INPUT */}
            <div className="relative flex flex-col w-full md:w-56 shrink-0">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 pl-1">
                    Include Tags
                </label>
                <input
                    value={include}
                    type="text"
                    onChange={(e) => setInclude(e.target.value)}
                    onFocus={() => setIsIncludeSuggestionOpen(true)}
                    onBlur={() => setIsIncludeSuggestionOpen(false)}
                    placeholder="e.g. Urgent"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm transition-all 
                               bg-slate-50 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                               outline-none placeholder:text-slate-400"
                />

                {isIncludeSuggestionOpen && filteredIncludeTags.length > 0 && (
                    <div
                        className="absolute z-50 top-full mt-2 shadow-lg
                                   w-full max-h-48 flex flex-col
                                   bg-white border border-slate-200
                                   rounded-xl overflow-y-auto py-1"
                    >
                        {filteredIncludeTags.map((tag) => (
                            <button
                                key={tag.id}
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                    setInclude(tag.tag_name);
                                    setIsIncludeSuggestionOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                            >
                                {tag.tag_name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* EXCLUDE INPUT */}
            <div className="relative flex flex-col w-full md:w-56 shrink-0">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 pl-1">
                    Exclude Tags
                </label>
                <input
                    value={exclude}
                    type="text"
                    placeholder="e.g. Completed"
                    onChange={(e) => setExclude(e.target.value)}
                    onFocus={() => setIsExcludeSuggestionOpen(true)}
                    onBlur={() => setIsExcludeSuggestionOpen(false)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm transition-all 
                               bg-slate-50 text-slate-800 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 
                               outline-none placeholder:text-slate-400"
                />

                {isExcludeSuggestionOpen && filteredExcludeTags.length > 0 && (
                    <div
                        className="absolute z-50 top-full mt-2 shadow-lg
                                   w-full max-h-48 flex flex-col
                                   bg-white border border-slate-200
                                   rounded-xl overflow-y-auto py-1"
                    >
                        {filteredExcludeTags.map((tag) => (
                            <button
                                key={tag.id}
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                    setExclude(tag.tag_name);
                                    setIsExcludeSuggestionOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                            >
                                {tag.tag_name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* SEARCH INPUT */}
            <div className="flex flex-col grow w-full">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 pl-1">
                    Search Agenda
                </label>
                <div className="flex w-full">
                    <input
                        value={search}
                        type="search"
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Type keywords here..."
                        className="grow border border-slate-200 rounded-xl px-4 py-3 text-sm transition-all 
                                   bg-slate-50 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                                   outline-none placeholder:text-slate-400"
                    />
                </div>
            </div>
        </form>
    );
}