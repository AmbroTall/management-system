import { useEffect } from "react";

const Toast = ({ message, isError = false, onDismiss, duration = 3000 }) => {
    useEffect(() => {
        // Automatically dismiss the toast after the specified duration
        const timer = setTimeout(() => {
            onDismiss();
        }, duration);

        return () => clearTimeout(timer); // Clear timer on component unmount
    }, [onDismiss, duration]);

    return (
        <div
            className={`fixed bottom-4 right-4 p-4 rounded shadow-lg ${
                isError ? "bg-red-500 text-white" : "bg-green-500 text-white"
            } flex justify-between items-center gap-4`}
            style={{ minWidth: "250px" }}
        >
            <span>{message}</span>
            <button
                onClick={onDismiss}
                className="text-lg font-bold hover:text-gray-200"
            >
                &times;
            </button>
        </div>
    );
};

export default Toast;
