import { useForm } from "@inertiajs/react";
import AgendaProgressBar from "./AgendaProgressBar";
import TagBubble from "./TagBubble";

export default function AgendaCreate({
    availableTags,
    onCancel,
    agendaData = null,
}) {
    const isEdit = !!agendaData;

    const initialData = {
        content: agendaData?.content || "",
        note: agendaData?.note || "",
        progress: agendaData?.progress || 0,
        isSuspended: agendaData?.isSuspended || false,
        tags: agendaData?.tags ? agendaData.tags.map((tag) => tag.id) : [],
    };

    const { data, setData, post, put, processing, errors } =
        useForm(initialData);

    const handleToggleTag = (tagId) => {
        if (data.tags.includes(tagId)) {
            setData(
                "tags",
                data.tags.filter((id) => id !== tagId),
            );
        } else {
            setData("tags", [...data.tags, tagId]);
        }
    };

    const handleProgressClick = (step) => {
        setData("progress", step);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        isEdit === false
            ? post(route("agenda.store"), {
                  preserveScroll: true,
                  onSuccess: () => {
                      onCancel();
                  },
              })
            : put(route("agenda.update", agendaData.id), {
                  preserveScroll: true,
                  onSuccess: () => {
                      onCancel();
                  },
              });
    };

    return (
        <div className="bg-white flex flex-col grow rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
            <div className="flex justify-center items-center p-6 bg-gray-50 border-b border-gray-100">
                <h1 className="text-xl font-extrabold tracking-widest text-gray-800 uppercase">
                    {isEdit ? "EDIT " : "CREATE NEW "}AGENDA
                </h1>
            </div>

            <form
                className="p-6 md:p-8 flex flex-col gap-6"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="content"
                        className="text-sm font-semibold text-gray-700"
                    >
                        Your Agenda <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="content"
                        type="text"
                        value={data.content}
                        onChange={(e) => setData("content", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm transition-all 
                                   focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        placeholder="What do you plan to do?"
                        required
                    />
                    {errors.content && (
                        <span className="text-red-500 text-xs font-medium">
                            {errors.content}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="note"
                        className="text-sm font-semibold text-gray-700 flex items-center justify-between"
                    >
                        <span>Additional Note</span>
                        <span className="text-gray-400 font-normal text-xs italic">
                            *Optional
                        </span>
                    </label>
                    <textarea
                        id="note"
                        rows={3}
                        value={data.note}
                        onChange={(e) => setData("note", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm transition-all 
                                   focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-y"
                        placeholder="Any extra details?"
                    />
                    {errors.note && (
                        <span className="text-red-500 text-xs font-medium">
                            {errors.note}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                        <span>Current Progress</span>
                        <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-md text-xs">
                            {data.progress}%
                        </span>
                    </label>
                    
                    <div className="px-1">
                        <AgendaProgressBar
                            currentProgress={data.progress}
                            onProgressChange={handleProgressClick}
                        />
                    </div>

                    {errors.progress && (
                        <span className="text-red-500 text-xs font-medium">
                            {errors.progress}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-gray-700">Agenda Status</span>
                    <label
                        htmlFor="isSuspended"
                        className="relative inline-flex items-center cursor-pointer w-max"
                    >
                        <input
                            id="isSuspended"
                            type="checkbox"
                            className="sr-only peer"
                            checked={data.isSuspended}
                            onChange={(e) =>
                                setData("isSuspended", e.target.checked)
                            }
                        />
                        <div className="w-11 h-6 bg-green-500 peer-focus:outline-none rounded-full peer 
                                      peer-checked:after:translate-x-full peer-checked:after:border-white 
                                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                      after:bg-white after:border-gray-300 after:border after:rounded-full 
                                      after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500">
                        </div>
                        <span
                            className={`ml-3 text-sm font-bold ${
                                data.isSuspended ? "text-red-500" : "text-green-600"
                            }`}
                        >
                            {data.isSuspended ? "Suspended" : "Active"}
                        </span>
                    </label>
                    {errors.isSuspended && (
                        <span className="text-red-500 text-xs font-medium">
                            {errors.isSuspended}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
                    <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                        <span>Tags</span>
                        <span className="text-gray-400 font-normal text-xs italic">
                            *Optional
                        </span>
                    </label>

                    <div className="flex flex-wrap w-full gap-2 p-4 bg-gray-50 border border-gray-100 rounded-lg min-h-[4rem] items-center">
                        {availableTags?.length > 0 ? (
                            availableTags.map((tag) => (
                                <TagBubble
                                    key={tag.id}
                                    tag={tag}
                                    isSelected={data.tags.includes(tag.id)}
                                    onToggle={() => handleToggleTag(tag.id)}
                                />
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 italic">No Tags Available</p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end items-center gap-3 mt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={processing}
                        className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 
                                   rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 text-sm font-semibold text-white bg-green-600 border border-transparent 
                                   rounded-lg shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500/50 
                                   transition-all duration-200 disabled:opacity-50"
                    >
                        {isEdit ? "Update Agenda" : "Save Agenda"}
                    </button>
                </div>
            </form>
        </div>
    );
}