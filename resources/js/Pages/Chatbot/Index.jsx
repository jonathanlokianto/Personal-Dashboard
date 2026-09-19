import MainLayout from "../../Layouts/MainLayout";
import ChatBubbleBase from "./Partials/ChatBubbleBase";
import TypeBubble from "./Partials/TypeBubble";
import TrashIcon from "../../../assets/images/TrashIcon.png";
import GearIcon from "../../../assets/images/GearIcon.png";
import stopButton from "../../../assets/images/stopButton.png";

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
                        // alert("Gagal memproses AI: " + parsed.message);
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
                preserveState,
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
            className="bg-gray-800 flex flex-col grow w-full h-screen py-4 px-4 md:px-30 mx-4 rounded-2xl shadow-xl relative overflow-hidden outline-3 outline-white"
        >
            <div
                className="absolute top-6 left-1/2 
                        -translate-x-1/2 z-50 
                        w-full max-w-md px-4 
                        flex flex-col gap-2 justify-center pointer-events-none"
            >
                {notifications.map((notif) => (
                    <ChatFlashNotification
                        key={notif.id}
                        message={notif.message}
                        onClose={() => deleteNotification(notif.id)}
                    />
                ))}
            </div>

            <div
                ref={chatAreaRef}
                id="chatArea"
                className="flex flex-col grow overflow-y-auto gap-4 p-4 md:p-6 scroll-smooth scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
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
                    <div className="text-gray-400 text-lg flex-col items-center justify-center my-6 mx-auto w-full text-center">
                        No Messages Yet
                    </div>
                )}

                {(isStreaming || isFetching || isWaitingSync) && (
                    <div className="flex w-full mt-2 space-x-3 max-w-2xl">
                        <ChatBubbleBase
                            chatData={{
                                role: "assistant",
                                message_content: parsedStreamText
                                    ? parsedStreamText
                                    : `Writing${dots}`,
                            }}
                            modelName={activePreset?.model_name || "Assistant"}
                            isStreaming={true}
                        />
                    </div>
                )}
                <div ref={latestMessageRef} />
            </div>

            {!isAtBottomChat && (
                <button
                    onClick={scrollToBottom}
                    className="absolute z-50 bottom-56 left-1/2 -translate-x-1/2 bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-full shadow-lg transition-all animate-bounce"
                    title="Go to Bottom"
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

            <div className="flex flex-col bg-gray-800 border-t border-gray-700/50">
                <div className="flex justify-between px-6 pt-3 -mb-1 caret-transparent">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-700/30 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all duration-300 border border-transparent hover:border-red-500/20 group"
                    >
                        <img
                            src={GearIcon}
                            className="w-4 h-4 group-hover:opacity-100 transition-opacity"
                        />
                    </button>
                    <button
                        onClick={handleDeleteAllMessages}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-700/30 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all duration-300 border border-transparent hover:border-red-500/20 group"
                    >
                        <img
                            src={TrashIcon}
                            className="w-4 h-4 group-hover:opacity-100 transition-opacity"
                        />
                    </button>
                </div>

                {/* START TYPE BUBBLE */}

                <div className="flex-none p-4">
                    <TypeBubble
                        onMessageSend={handleStreamingResponses}
                        isStreaming={isStreaming || isFetching}
                        onStopStream={cancel}
                    />
                </div>
                {/* END TYPE BUBBLE */}

                {/* START SETTINGS WINDOW */}

                {isModalOpen && (
                    <SettingModal
                        innerModalAreaRef={innerModalAreaRef}
                        onClose={closeModalSettings}
                    />
                )}

                {/* END SETTINGS WINDOW */}
            </div>
        </div>
    );
}

Index.layout = (page) => <MainLayout children={page} />;
