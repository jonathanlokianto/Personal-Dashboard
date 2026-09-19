import { router, useForm } from "@inertiajs/react";
import TagBubble from "./TagBubble";

export default function TagCreate({ tagData = null, onExit }) {
    const isEdit = !!tagData;

    const initialData = {
        tag_name: tagData?.tag_name || "",
    };

    const { data, setData, put, post, processing, errors } =
        useForm(initialData);

    const onDeleteTag = () => {
        router.delete(route("tag.destroy", tagData.id), {
            onSuccess: () => {
                onExit();
            },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        !isEdit
            ? post(route("tag.store"), {
                  preserveScroll: true,
                  onSuccess: () => {
                      onExit();
                  },
              })
            : put(route("tag.update", tagData.id), {
                  onSuccess: () => {
                      onExit();
                  },
              });
    };

    return (
        <div className="bg-white flex flex-col w-[90vw] sm:w-full max-w-md rounded-xl shadow-2xl border border-gray-100 overflow-hidden scale-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex justify-center items-center p-5 bg-gray-50 border-b border-gray-100">
                <h1 className="text-lg font-extrabold tracking-widest text-gray-800 uppercase">
                    {!isEdit ? "CREATE NEW" : "EDIT"} TAG
                </h1>
            </div>

            {/* Form */}
            <form
                className="p-6 md:p-8 flex flex-col gap-6"
                onSubmit={handleSubmit}
            >
                {/* Input TAG Name */}
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="tag_name"
                        className="text-sm font-semibold text-gray-700"
                    >
                        Tag Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="tag_name"
                        type="text"
                        value={data.tag_name}
                        onChange={(e) =>
                            setData("tag_name", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm transition-all 
                                   focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        placeholder="e.g. Urgent, Personal, Work"
                        required
                        autoFocus
                    />
                    {errors.tag_name && (
                        <span className="text-red-500 text-xs font-medium">
                            {errors.tag_name}
                        </span>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-between items-center mt-2 pt-4 border-t border-gray-100">
                    <div>
                        {isEdit && (
                            <button
                                type="button"
                                onClick={onDeleteTag}
                                className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-transparent 
                                           rounded-lg hover:bg-red-100 transition-all duration-200"
                            >
                                Delete Tag
                            </button>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onExit}
                            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 
                                       rounded-lg hover:bg-gray-50 transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 border border-transparent 
                                       rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/50 
                                       transition-all duration-200 disabled:opacity-50"
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}