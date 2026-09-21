import MainLayout from "../../Layouts/MainLayout";
import ChatBubbleBase from "./Partials/ChatBubbleBase";
import TypeBubble from "./Partials/TypeBubble";
import TrashIcon from "../../../assets/images/TrashIcon.png";
import GearIcon from "../../../assets/images/GearIcon.png";

import SettingModal from "./Partials/SettingModal";

import { useEffect, useRef, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { useStream } from "@laravel/stream-react";
import ChatFlashNotification from "./Partials/ChatFlashNotification";

export default function Index({ chatHistory }) {
    const [isAtBottomChat, setIsAtBottomChat] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(null);
    const [dots, setDots] = useState("");
    const [localChats, setLocalChats] = useState(chatHistory);
    const [parsedStreamText, setParsedStreamText] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [isWaitingSync, setIsWaitingSync] = useState(false);

    const { activePreset } = usePage().props;

    const latestMessageRef = useRef(null);
    const innerModalAreaRef = useRef(null);
    const chatAreaRef = useRef(null);

    const scrollToBottom = () => {
        chatAreaRef.current?.scrollTo({
            top: chatAreaRef.current?.scrollHeight,
            behavior: "smooth",
        });
    };

    const closeModalSettings = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        setLocalChats(chatHistory);
    }, [chatHistory]);

    // START NOTIFICATION
    const createNotification = (msg) => {
        const newNotifId = Date.now();
        setNotifications((prev) => [...prev, { id: newNotifId, message: msg }]);
        setTimeout(() => {
            setNotifications((prev) =>
                prev.filter((notif) => notif.id !== newNotifId),
            );
        }, 10000);
    };

    const deleteNotification = (notifId) => {
        setNotifications((prev) =>
            prev.filter((notif) => notif.id !== notifId),
        );
    };
    // END NOTIFICATION

    // START STREAMING
    const { data, isFetching, isStreaming, send, cancel } =
        useStream("/chatbot/stream");

    useEffect(() => {
        if (isStreaming) {
            scrollToBottom();
        }
    }, [isStreaming, data]);

    const handleStreamingResponses = (
        userPrompt,
        restarted = false,
        restartedChatId = null,
    ) => {
        setParsedStreamText("");
        const tempUserMessage = {
            id: `temp-${Date.now()}`,
            role: "user",
            message_content: userPrompt,
            created_at: new Date().toISOString(),
        };

        setLocalChats((prevChats) => {
            let updatedChats = [...prevChats];
            if (restarted && restartedChatId) {
                const targetIndex = updatedChats.findIndex(
                    (chat) => chat.id === restartedChatId,
                );
                if (targetIndex !== -1) {
                    updatedChats = updatedChats.slice(0, targetIndex);
                }
            }
            return [...updatedChats, tempUserMessage];
        });

        send({
            content: [
                {
                    type: "prompt",
                    content: userPrompt,
                    isResend: restarted,
                },
            ],
        });

        setTimeout(() => {
            scrollToBottom();
        }, 100);
    };

    useEffect(() => {
        if (!isStreaming && data) {
            setIsWaitingSync(true);

            router.reload({
                only: ["chatHistory"],
                preserveScrolls: true,
                preserveState: true,
                onSuccess: () => {
                    setIsWaitingSync(false);
                    setParsedStreamText("");
                    scrollToBottom();
                },
                onError: () => {
                    setIsWaitingSync(false);
                },
            });
        }
    }, [isStreaming]);

    useEffect(() => {
        let interval;
        if ((isStreaming || isFetching) && !data) {
            interval = setInterval(() => {
                setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
            }, 400);
        } else {
            setDots("");
        }
        return () => clearInterval(interval);
    }, [isStreaming, isFetching, data]);

    useEffect(() => {
        if (!data) {
            setParsedStreamText("");
            return;
        }
        const lines = data.split("\n");
        let tempText = "";

        for (const line of lines) {
            if (line.startsWith("data: ")) {
                try {
                    const jsonStr = line.replace("data: ", "").trim();
                    if (!jsonStr) continue;

                    const parsed = JSON.parse(jsonStr);
                    if (parsed.status === "error") {
                        if (cancel) cancel();
                        createNotification(parsed.message);
                        return;
                    } else if (parsed.status === "success") {
                        tempText += parsed.chunk;
                    }
                } catch {}
            }
        }
        setParsedStreamText(tempText);
    }, [data]);
    // END STREAMING

    useEffect(() => {
        const handleOuterSettingModalClick = (e) => {
            if (
                innerModalAreaRef.current &&
                !innerModalAreaRef.current.contains(e.target)
            ) {
                setIsModalOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOuterSettingModalClick);
        return () =>
            document.removeEventListener(
                "mousedown",
                handleOuterSettingModalClick,
            );
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => document.body.classList.remove("overflow-hidden");
    }, [isModalOpen]);

    const handleDeleteAllMessages = () => {
        if (
            window.confirm("Do you really want to clear this chat's history?")
        ) {
            router.delete(route("chatbot.clear"), {
                preserveScrolls: true,
                preserveState: true,
                onSuccess: () => {
                    createNotification("The chat history has been cleared");
                },
                onError: () => {
                    createNotification("Failed to clear chat history");
                },
            });
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsAtBottomChat(entry.isIntersecting);
            },
            { threshold: 0.1 },
        );

        if (latestMessageRef.current) {
            observer.observe(latestMessageRef.current);
        }
        return () => {
            if (latestMessageRef.current) {
                observer.unobserve(latestMessageRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isAtBottomChat) {
            const timeOut = setTimeout(() => {
                scrollToBottom();
            }, 50);
            return () => clearTimeout(timeOut);
        }
    }, [localChats]);

    useEffect(() => {
        if (window.Echo) {
            const chatChannel = window.Echo.channel("chatbot_channel");
            chatChannel.listen(".RealtimeMessage", () => {
                router.reload({ only: ["chatHistory"] });
            });

            const chatTruncateChannel = window.Echo.channel(
                "truncateChatHistory-channel",
            );
            chatTruncateChannel.listen(".chatHistorytruncated", () => {
                router.reload({ only: ["chatHistory"] });
            });
            return () => {
                window.Echo.leaveChannel("chatbot_channel");
                window.Echo.leaveChannel("truncateChatHistory-channel");
            };
        }
    }, []);

    return (
        <div
            id="chatBoundary"
            className="bg-slate-100 flex flex-col grow w-full h-screen py-4 px-3 md:px-12 mx-auto rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 relative overflow-hidden"
        >
            {/* Flash Notifications Container */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 flex flex-col gap-2 justify-center pointer-events-none">
                {notifications.map((notif) => (
                    <ChatFlashNotification
                        key={notif.id}
                        message={notif.message}
                        onClose={() => deleteNotification(notif.id)}
                    />
                ))}
            </div>

            {/* Main Chat Stream Container */}
            <div
                ref={chatAreaRef}
                id="chatArea"
                className="flex flex-col grow overflow-y-auto gap-4 p-3 md:p-6 scroll-smooth scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
            >
                {localChats?.length > 0 ? (
                    localChats.map((chat, index) => {
                        const isLatestMessage = index === localChats.length - 1;
                        return (
                            <ChatBubbleBase
                                key={chat.id}
                                chatData={chat}
                                isLatest={isLatestMessage}
                                isLoading={isFetching}
                                onMessageSendRepeat={() =>
                                    handleStreamingResponses(
                                        chat.message_content,
                                        true,
                                        chat.id,
                                    )
                                }
                            />
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center my-auto text-center py-12">
                        <div className="w-16 h-16 mb-3 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500">
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                        </div>
                        <p className="text-slate-500 font-medium text-base">
                            No messages yet
                        </p>
                        <p className="text-slate-400 text-xs mt-1">
                            Start chatting
                        </p>
                    </div>
                )}

                {(isStreaming || isFetching || isWaitingSync) && (
                    <div className="flex w-full mt-2 space-x-3 max-w-2xl">
                        <ChatBubbleBase
                            chatData={{
                                role: "assistant",
                                message_content: parsedStreamText
                                    ? parsedStreamText
                                    : `Typing${dots}`,
                            }}
                            modelName={activePreset?.model_name || "Assistant"}
                            isStreaming={true}
                        />
                    </div>
                )}
                <div ref={latestMessageRef} />
            </div>

            {/* Scroll to Bottom Floating Button */}
            {!isAtBottomChat && (
                <button
                    onClick={scrollToBottom}
                    className="absolute z-40 bottom-44 left-1/2 -translate-x-1/2 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg shadow-indigo-200 transition-all duration-200 animate-bounce active:scale-95"
                    title="Ke Pesan Terakhir"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </button>
            )}

            {/* Bottom Controls & Input Section */}
            <div className="flex flex-col bg-white border-t border-slate-200/80 rounded-b-2xl -mx-3 -mb-4 md:-mx-12">
                <div className="flex justify-between items-center px-6 pt-3 select-none">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-500 bg-slate-100/80 hover:bg-slate-200/70 hover:text-slate-800 rounded-lg transition-all duration-200 border border-slate-200/60 group shadow-xs"
                        title="Pengaturan"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                        <span>Settings</span>
                    </button>
                    <button
                        onClick={handleDeleteAllMessages}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-500 bg-slate-100/80 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 border border-slate-200/60 hover:border-red-200 group shadow-xs"
                        title="Delete History"
                    >
                        <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span>Clear Chat</span>
                    </button>
                </div>

                {/* TYPE BUBBLE AREA */}
                <div className="flex-none p-4">
                    <TypeBubble
                        onMessageSend={handleStreamingResponses}
                        isStreaming={isStreaming || isFetching}
                        onStopStream={cancel}
                    />
                </div>

                {/* SETTINGS MODAL */}
                {isModalOpen && (
                    <SettingModal
                        innerModalAreaRef={innerModalAreaRef}
                        onClose={closeModalSettings}
                    />
                )}
            </div>
        </div>
    );
}

Index.layout = (page) => <MainLayout children={page} />;
