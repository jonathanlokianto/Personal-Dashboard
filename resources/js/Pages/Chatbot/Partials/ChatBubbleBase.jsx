export default function ChatBubbleBase({ chatData, modelName, isLatest, isLoading, onMessageSendRepeat }) {
    const chatRole = chatData.role || "assistant";
    const isUser = chatRole === "user";

    let shortModelName = modelName
        ? modelName
              .split("/")
              .pop()
              .replace(/-instruct|:free/g, "")
        : "Assistant";

    return (
        <div
            className={`flex flex-col mx-2 md:mx-4 my-1.5 w-fit max-w-[85%] ${
                isUser ? "self-end items-end" : "self-start items-start"
            }`}
        >
            <span className="text-[11px] text-slate-400 font-semibold px-1 mb-1 tracking-wider uppercase">
                {isUser ? "You" : shortModelName}
            </span>


            <div
                className={`flex flex-col rounded-2xl px-4 py-3 shadow-xs transition-all duration-200 ${
                    isUser
                        ? "bg-indigo-600 text-white rounded-tr-xs"
                        : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-slate-100"
                }`}
            >
                <div className="flex flex-col min-w-20">
                    <div className="text-sm md:text-base whitespace-pre-wrap leading-relaxed tracking-normal font-normal">
                        {chatData.message_content}
                    </div>

                    {/* Timestamp */}
                    <div
                        className={`flex justify-end mt-1.5 -mb-0.5 ${
                            isUser ? "text-indigo-100/80" : "text-slate-400"
                        }`}
                    >
                        <span className="text-[10px] font-medium tracking-tight">
                            {chatData.created_at
                                ? new Date(chatData.created_at).toLocaleString(
                                      "id-ID",
                                      {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      },
                                  )
                                : ""}
                        </span>
                    </div>
                </div>
            </div>

            {isLatest && isUser && !isLoading && (
                <button
                    onClick={onMessageSendRepeat}
                    className="mt-1 p-1 text-slate-400 hover:text-indigo-600 transition-colors duration-200 rounded-full hover:bg-slate-200/50"
                    title="Resend Message"
                >
                    <svg
                        className="w-4 h-4 stroke-current fill-none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                    </svg>
                </button>
            )}
        </div>
    );
}