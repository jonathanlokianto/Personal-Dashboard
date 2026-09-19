export default function ChatBubbleBase({ chatData, modelName, isLatest, isLoading, onMessageSendRepeat }) {
    const chatRole = chatData.role || "assistant";
    const isUser = chatRole === "user";

    let shortModelName = modelName
        ? modelName
              .split("/")
              .pop()
              .replace(/-instruct|:free/g, "")
        : "Assistant";
    console.log(modelName);
    console.log(shortModelName);


    return (
        <div
            className={`flex flex-col mx-6 my-2 w-fit max-w-[85%] ${
                isUser ? "self-end items-end" : "self-start items-start"
            }`}
        >
            <span className="text-xs text-gray-400 font-medium px-2 mb-1 capitalize tracking-wide">
                {isUser ? "You" : shortModelName}
            </span>

            <div
                className={`flex wrap-break-words rounded-2xl px-5 py-2.5 text-white shadow-md ${
                    isUser
                        ? "bg-green-600 rounded-tr-none"
                        : "bg-gray-600 rounded-tl-none"
                }`}
            >
                <div className="flex flex-col min-w-20">
                    <div className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                        {chatData.message_content}
                    </div>

                    {/* Waktu Pesan */}
                    <div className="flex justify-end mt-1.5 -mb-1 -mr-1">
                        <span className="text-[11px] font-medium opacity-70">
                            {new Date(chatData.created_at).toLocaleString(
                                "id-ID",
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                },
                            )}
                        </span>
                    </div>
                </div>
            </div>

            {isLatest && isUser && !isLoading && (
                <svg
                    fill="#ffffff"
                    width="30px"
                    height="30px"
                    viewBox="-7.5 0 32 32"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#ffffff"
                    onClick={onMessageSendRepeat}
                    className="transition-opacity duration-300 hover:opacity-50"
                >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                        {" "}
                        <title>restart</title>{" "}
                        <path d="M15.88 13.84c-1.68-3.48-5.44-5.24-9.040-4.6l0.96-1.8c0.24-0.4 0.080-0.92-0.32-1.12-0.4-0.24-0.92-0.080-1.12 0.32l-1.96 3.64c0 0-0.44 0.72 0.24 1.040l3.64 1.96c0.12 0.080 0.28 0.12 0.4 0.12 0.28 0 0.6-0.16 0.72-0.44 0.24-0.4 0.080-0.92-0.32-1.12l-1.88-1.040c2.84-0.48 5.8 0.96 7.12 3.68 1.6 3.32 0.2 7.32-3.12 8.88-1.6 0.76-3.4 0.88-5.080 0.28s-3.040-1.8-3.8-3.4c-0.76-1.6-0.88-3.4-0.28-5.080 0.16-0.44-0.080-0.92-0.52-1.080-0.4-0.080-0.88 0.16-1.040 0.6-0.72 2.12-0.6 4.36 0.36 6.36s2.64 3.52 4.76 4.28c0.92 0.32 1.84 0.48 2.76 0.48 1.24 0 2.48-0.28 3.6-0.84 4.16-2 5.92-7 3.92-11.12z"></path>{" "}
                    </g>
                </svg>
            )}
        </div>
    );
}
