import { useState, useEffect, useRef } from "react";
import { usePage } from "@inertiajs/react";

function ToastItem({ notif, onClose }) {
    const [isPaused, setIsPaused] = useState(false);
    const duration = 6000;
    
    const timerId = useRef(null);
    const startTime = useRef(null);
    const remainingTime = useRef(duration);

    const startTimer = (time) => {
        startTime.current = Date.now();
        timerId.current = setTimeout(() => {
            onClose(notif.id);
        }, time);
    };

    useEffect(() => {
        startTimer(remainingTime.current);
        return () => clearTimeout(timerId.current);
    }, []);

    const handleMouseEnter = () => {
        setIsPaused(true);
        if (timerId.current) {
            clearTimeout(timerId.current);
            const elapsed = Date.now() - startTime.current;
            remainingTime.current = Math.max(0, remainingTime.current - elapsed);
        }
    };

    const handleMouseLeave = () => {
        setIsPaused(false);
        if (remainingTime.current > 0) {
            startTimer(remainingTime.current);
        }
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`
                relative overflow-hidden pointer-events-auto
                text-white rounded-md shadow-lg transition-all flex flex-col min-w-[300px] duration-500
                ease-in-out hover:translate-y-1
                ${notif.type === "negative" ? "bg-red-500" : "bg-green-500"}
            `}
        >
            <div className="flex items-center justify-between p-3">
                <span className="font-medium">{notif.message}</span>
                <button
                    className="ml-4 text-white/70 hover:text-white font-bold text-sm outline-none"
                    onClick={() => onClose(notif.id)}
                >
                    ✕
                </button>
            </div>
            
            <div
                className="h-1 bg-white/40 origin-left"
                style={{
                    animation: `shrink ${duration}ms linear forwards`,
                    animationPlayState: isPaused ? "paused" : "running",
                }}
            />
            
            <style>{`
                @keyframes shrink {
                    from { transform: scaleX(1); }
                    to { transform: scaleX(0); }
                }
            `}</style>
        </div>
    );
}


export default function FlashNotification() {
    const { flash } = usePage().props;
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type = "positive") => {
        if (!message) return;
        const id = Date.now() + Math.random();
        setNotifications((prev) => [...prev, { id, type, message }]);
    };

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };

    useEffect(() => {
        if (flash?.message) {
            addNotification(flash.message, flash.type);
        }
    }, [flash]);

    useEffect(() => {
        if (window.Echo) {
            const channel = window.Echo.channel("notification-channel");
            channel.listen(".RealtimeNotification", (e) => {
                addNotification(e.message, e.type);
            });
            return () => window.Echo.leave("notification-channel");
        }
    }, []);

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-3 pointer-events-none cursor-default">
            {notifications.map((notif) => (
                <ToastItem 
                    key={notif.id} 
                    notif={notif} 
                    onClose={removeNotification} 
                />
            ))}
        </div>
    );
}