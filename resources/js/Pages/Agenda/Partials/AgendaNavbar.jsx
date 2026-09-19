import { useEffect, useRef, useState } from "react";

export default function SubNavbar({ onSearch, searchFilters, tagList }) {
    const [include, setInclude] = useState(searchFilters?.include || "");
    const [exclude, setExclude] = useState(searchFilters?.exclude || "");
    const [search, setSearch] = useState(searchFilters?.search || "");

    const [isIncludeSuggestionOpen, setIsIncludeSuggestionOpen] =
        useState(false);
    const [isExcludeSuggestionOpen, setIsExcludeSuggestionOpen] =
        useState(false);

    const initialRender = useRef(true);

    const num = 10;

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

    // const handleSubmitButton = (e) => {
    //     e.preventDefault();
    //     onSearch?.({filters: { include, exclude, search }});

    // };

    const handlePreventSubmit = (e) => e.preventDefault();

    return (
        <form
            // onSubmit={handleSubmitButton}
            onSubmit={handlePreventSubmit}
            className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 bg-white p-5 w-full shadow-sm border-b border-gray-100"
        >
            <div className="relative flex flex-col w-full md:w-48 lg:w-56 shrink-0">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 pl-1">
                    Include
                </label>
                <input
                    value={include}
                    type="text"
                    onChange={(e) => setInclude(e.target.value)}
                    onFocus={() => setIsIncludeSuggestionOpen(true)}
                    onBlur={() =>
                        setTimeout(() => setIsIncludeSuggestionOpen(false), 100)
                    }
                    placeholder="Include tags..."
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm transition-all 
                               bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                               outline-none placeholder:text-gray-400"
                />

                {isIncludeSuggestionOpen && (
                    <div
                        className="absolute z-50 top-full shadow-lg
                                    w-full max-h-48
                                    flex flex-col
                                    outline-1 -outline-offset-1 outline-white/10
                                    rounded-md
                                    overflow-y-auto
                                    "
                    >
                        {tagList.map((tag) => (
                            <button
                                key={tag.id}
                                className="bg-gray-50
                                    block
                                    text-left 
                                    p-2
                                    transition transiton-all
                                    hover:bg-gray-200
                                    "
                                onClick={()=>setInclude(tag.tag_name)}
                            >
                                {tag.tag_name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="relative flex flex-col w-full md:w-48 lg:w-56 shrink-0">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 pl-1">
                    Exclude
                </label>
                <input
                    value={exclude}
                    type="text"
                    placeholder="Exclude tags..."
                    onChange={(e) => setExclude(e.target.value)}
                    onFocus={()=>setIsExcludeSuggestionOpen(true)}
                    onBlur={()=>setTimeout(()=>setIsExcludeSuggestionOpen(false), 100)}
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm transition-all 
                               bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 
                               outline-none placeholder:text-gray-400"
                />

                {isExcludeSuggestionOpen && (
                    <div
                        className="absolute z-50 top-full shadow-lg
                                    w-full max-h-48
                                    flex flex-col
                                    outline-1 -outline-offset-1 outline-white/10
                                    rounded-md
                                    overflow-y-auto
                                    "
                    >
                        {tagList.map((tag) => (
                            <button
                                key={tag.id}
                                className="bg-gray-50
                                    block
                                    text-left 
                                    p-2
                                    transition transiton-all
                                    hover:bg-gray-200
                                    "
                                onClick={()=>setExclude(tag.tag_name)}
                            >
                                {tag.tag_name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-col grow w-full">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 pl-1">
                    Search
                </label>
                <div className="flex w-full rounded-lg shadow-sm">
                    <input
                        value={search}
                        type="search"
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search agenda..."
                        className="flex-grow border border-gray-300 border-r-0 rounded-l-lg px-4 py-2.5 text-sm transition-all 
                                   bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                                   outline-none placeholder:text-gray-400 z-10"
                    />
                    {/* <button
                        type="submit"
                        className="bg-blue-600 text-white font-semibold text-sm px-6 py-2.5 rounded-r-lg 
                                   hover:bg-blue-700 transition-colors shrink-0 z-20 outline-none focus:ring-2 focus:ring-blue-500/50"
                    > */}
                    {/* Search */}
                    {/* </button> */}
                </div>
            </div>
        </form>
    );
}
