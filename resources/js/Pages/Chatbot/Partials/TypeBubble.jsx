import { useState } from "react";

export default function TypeBubble({
    onMessageSend,
    isStreaming,
    onStopStream,
}) {
    const [messageContent, setMessageContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const messageOnSend = async (e) => {
        e.preventDefault();
        if (!messageContent.trim() || isStreaming || isSubmitting) return;

        setIsSubmitting(true);

        try {
            if (onMessageSend) {
                await onMessageSend(messageContent);
            }
            setMessageContent("");
        } finally {
            setTimeout(() => {
                setIsSubmitting(false);
            }, 300);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            messageOnSend(e);
        }
    };

    return (
        <div
            id="typeBase"
            className="flex sticky bottom-6 mx-auto 
                       w-full h-fit
                       bg-slate-700 border border-slate-700 
                       rounded-3xl shadow-xl overflow-hidden
                       transition-all duration-300 ease-in
                       focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/50"
        >
            <form
                id="typeArea"
                onSubmit={messageOnSend}
                className="flex flex-row grow items-end px-2 py-2 gap-2"
                disabled={isStreaming}
            >
                <textarea
                    className="grow bg-transparent text-slate-100 placeholder-slate-400
                               px-4 py-3 focus:outline-none resize-none
                               min-h-12.5 max-h-[25vh] overflow-y-auto
                               scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
                    rows={1}
                    placeholder="Ask Anything ..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <button
                    type={isStreaming ? "button" : "submit"}
                    disabled={
                        (!isStreaming && !messageContent.trim()) || isSubmitting
                    }
                    onClick={isStreaming ? onStopStream : undefined}
                    className={`p-3 mr-1 mb-0.5 rounded-2xl text-white transition-all duration-300 shrink-0 shadow-md ${
                        isStreaming
                            ? "bg-red-500 hover:bg-red-600 cursor-pointer"
                            : "bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                    title={isStreaming ? "Stop Generating" : "Send Message"}
                >
                    {isStreaming ? (
                        <svg
                            className="w-5 h-5 animate-pulse"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <rect
                                x="6"
                                y="6"
                                width="12"
                                height="12"
                                rx="2"
                                ry="2"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="w-5 h-5 transform rotate-90"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                    )}
                </button>
            </form>
        </div>
    );
}
