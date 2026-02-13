"use client";
import { useEffect } from "react";
import toast, { Toaster, useToasterStore } from "react-hot-toast";

export default function ToasterProvider() {
    const { toasts } = useToasterStore();

    // Limit number of toasts to 1
    useEffect(() => {
        toasts
            .filter((t) => t.visible)
            .filter((_, i) => i >= 1) // Only keep the newest toast
            .forEach((t) => toast.dismiss(t.id));
    }, [toasts]);

    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            containerStyle={{ zIndex: 99999 }}
            toastOptions={{
                duration: 3000,
                style: {
                    background: "#333",
                    color: "#fff",
                    borderRadius: "10px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                },
            }}
        />
    );
}
