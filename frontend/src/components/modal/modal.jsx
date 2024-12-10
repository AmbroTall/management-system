const Modal = ({ title, children, onClose, size = "md" }) => {
    const sizeClasses = {
        sm: "w-1/4",
        md: "w-1/3",
        lg: "w-1/2",
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div
                className={`bg-gray-900 text-gray-100 rounded-lg shadow-xl border border-gray-700 ${sizeClasses[size]}`}
            >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-200 text-xl font-bold focus:outline-none"
                    >
                        &times;
                    </button>
                </div>
                {/* Modal Content */}
                <div className="px-6 py-4">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
