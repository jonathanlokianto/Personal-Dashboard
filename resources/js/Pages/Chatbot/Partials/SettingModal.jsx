import { router, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function SettingModal({ innerModalAreaRef, onClose }) {
    const { savedPresets, activePreset } = usePage().props;
    const [isCreateNewPreset, setIsCreateNewPreset] = useState(false);

    // console.log("Data dari Laravel:", savedPresets);

    const initialData = {
        id: activePreset?.id || "",
        preset_name: activePreset?.preset_name || "",
        model_name: activePreset?.model_name || "",
        model_proxy_url: activePreset?.model_proxy_url || "",
        model_api_key: activePreset?.model_api_key || "",
        model_custom_prompt: activePreset?.model_custom_prompt || "",
    };

    const { data, setData, processing, errors, post } = useForm(initialData);
    const [localSettingMemory, setLocalSettingMemory] =  useState(initialData);


    useEffect(() => {
        if (activePreset) {
            setData({
                id: activePreset.id || "",
                preset_name: activePreset.preset_name || "",
                model_name: activePreset.model_name || "",
                model_proxy_url: activePreset.model_proxy_url || "",
                model_api_key: activePreset.model_api_key || "",
                model_custom_prompt: activePreset.model_custom_prompt || "",
            });
        }
    }, [activePreset]);

    const refreshPresetSettingFormData = (e) => {
        e.stopPropagation();
        setData({
            id: "",
            preset_name: "",
            model_name: "",
            model_proxy_url: "",
            model_api_key: "",
            model_custom_prompt: "",
        });
    };

    const handleOnDropDownClick = (preset) => {
        setData({
            id: preset.id || "",
            preset_name: preset.preset_name || "",
            model_name: preset.model_name || "",
            model_proxy_url: preset.model_proxy_url || "",
            model_api_key: preset.model_api_key || "",
            model_custom_prompt: preset.model_custom_prompt || "",
        });
        router.post(
            route("chatbot.proxy-settings.set-active", preset.id),
            {},
            {
                preserveScroll: true,
                showProgress: false,
                preserveState: true,
            },
        );
    };

    const handleSubmitPreset = (e) => {
        e.preventDefault();
        // console.log("Menyimpan pengaturan: ", data);
        post(route("chatbot.proxy-settings.store"), {
            preserveScroll: true,
            onSuccess: () => console.log("SUKSES"),
        });
    };

    return (
        <div className="flex items-center justify-center inset-0 fixed z-50 bg-black/50 backdrop-blur-sm">
            <div
                className="bg-gray-800 outline-3 outline-white flex flex-col
                           h-[600px] w-[500px] max-w-[90vw] max-h-[90vh]
                           rounded-2xl overflow-hidden shadow-2xl"
                ref={innerModalAreaRef}
            >
                {/* START HEADER */}
                <div className="w-full relative flex items-center justify-center pt-5 pb-3">
                    <h2 className="text-lg font-bold text-gray-100 tracking-wider">
                        CHAT SETTINGS
                    </h2>
                    <button
                        onClick={onClose} // Berfungsi untuk menutup modal
                        className="absolute right-5 text-gray-400 hover:text-red-500 font-bold transition-colors text-xl"
                    >
                        ✕
                    </button>
                </div>
                <hr className="w-11/12 border-gray-600 mx-auto rounded-sm mb-4" />
                {/* END HEADER */}

                {/* START FORM AREA */}
                <form
                    onSubmit={handleSubmitPreset}
                    className="flex flex-col grow overflow-hidden"
                >
                    <div className="flex flex-col gap-5 px-8 pb-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                        <label className="flex flex-col gap-1.5">
                            <el-dropdown className="inline-block">
                                <button
                                    type="button"
                                    className="bg-white/10
                                    inline-flex w-full justify-center gap-x-1.5 
                                    rounded-md
                                    px-3 py-2
                                    text-white text-sm font-semibold
                                    inset-ring-1 inset-ring-white/5
                                    hover:bg-white/20"
                                >
                                    {!isCreateNewPreset
                                        ? data.preset_name || "Select Preset"
                                        : "Create New Preset"}
                                    <svg
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        data-slot="icon"
                                        aria-hidden="true"
                                        className="-mr-1 size-5 text-gray-400"
                                    >
                                        <path
                                            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                                            clipRule="evenodd"
                                            fillRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                <el-menu
                                    anchor="bottom middle"
                                    popover="auto"
                                    className="origin-top-right
                                                w-56  
                                                rounded-md 
                                                bg-gray-800 
                                                outline-1 -outline-offset-1 outline-white/10 
                                                transition transition-discrete [--anchor-gap:--spacing(2)] 
                                                data-closed:scale-95 data-closed:transform data-closed:opacity-0 
                                                data-enter:duration-100 data-enter:ease-out data-leave:duration-75 
                                                data-leave:ease-in"
                                >
                                    <div className="py-1">
                                        {savedPresets?.length > 0 ? (
                                            <>
                                                {savedPresets.map((preset) => {
                                                    const isCentangActive =
                                                        preset.id === data.id;
                                                    return (
                                                        <button
                                                            className={`
                                                            block w-full
                                                            text-left px-4 py-2 text-sm text-gray-300 
                                                            hover:bg-white/10 hover:text-white
                                                            ${preset.preset_isActive ? "relative" : ""}
                                                        `}
                                                            key={preset.id}
                                                            type="button"
                                                            onClick={() => {
                                                                handleOnDropDownClick(
                                                                    preset,
                                                                );
                                                                setIsCreateNewPreset(
                                                                    false,
                                                                );
                                                            }}
                                                        >
                                                            {preset?.preset_name ||
                                                                ""}
                                                            {isCentangActive && (
                                                                <>
                                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="24"
                                                                            height="24"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            stroke="#d1d5db"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        >
                                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                                        </svg>
                                                                    </span>
                                                                </>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </>
                                        ) : (
                                            <span className="block px-4 py-2 text-sm text-gray-500 italic">
                                                NO PRESETS YET
                                            </span>
                                        )}

                                        <button
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white"
                                            type="button"
                                            onClick={(e) => {
                                                refreshPresetSettingFormData(e);
                                                setIsCreateNewPreset(true);
                                                // setData(data.preset_name, "Create New Preset");
                                            }}
                                        >
                                            Create New Preset
                                        </button>
                                    </div>
                                </el-menu>
                            </el-dropdown>
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-semibold text-gray-300">
                                Preset Name
                            </span>
                            <input
                                type="text"
                                className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                placeholder="e.g. My Custom AI"
                                value={data.preset_name}
                                onChange={(e) =>
                                    setData("preset_name", e.target.value)
                                }
                            />
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-semibold text-gray-300">
                                Model Name
                            </span>
                            <input
                                type="text"
                                className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                placeholder="e.g. gpt-4-turbo"
                                value={data.model_name}
                                onChange={(e) =>
                                    setData("model_name", e.target.value)
                                }
                            />
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-semibold text-gray-300">
                                Proxy URL
                            </span>
                            <input
                                type="url"
                                className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                placeholder="e.g. https://openrouter.ai/api/v1"
                                value={data.model_proxy_url}
                                onChange={(e) =>
                                    setData("model_proxy_url", e.target.value)
                                }
                            />
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-semibold text-gray-300">
                                API Key
                            </span>
                            <input
                                type="password"
                                className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                placeholder="sk-..."
                                value={data.model_api_key}
                                onChange={(e) =>
                                    setData("model_api_key", e.target.value)
                                }
                            />
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-sm font-semibold text-gray-300">
                                Custom Prompt (System)
                            </span>
                            <textarea
                                className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
                                rows={4}
                                placeholder="Override the system prompt for this proxy..."
                                value={data.model_custom_prompt}
                                onChange={(e) =>
                                    setData(
                                        "model_custom_prompt",
                                        e.target.value,
                                    )
                                }
                            />
                        </label>
                    </div>

                    {/* START FOOTER */}
                    <div className="p-4 bg-gray-800 border-t border-gray-700 flex justify-end gap-3 mt-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg font-medium text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-md"
                        >
                            {processing ? "Saving..." : "Save Settings"}
                        </button>
                    </div>
                    {/* END FOOTER */}
                </form>
                {/* END FORM AREA */}
            </div>
        </div>
    );
}
