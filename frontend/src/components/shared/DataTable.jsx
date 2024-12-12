import { motion } from "framer-motion";
import Toast from "../common/toast"; 
import Modal from "../modal/modal"; 
import DynamicForm from "../shared/dynamicForms";

const modalTitles = {
    "create-member": "Create Member",
    "edit-member": "Edit Member",
    "create-role": "Create Role",
    "edit-role": "Edit Role",
    "delete-member": "Delete Member"
};

const DataTable = ({
    columns,
    data,
    onSort,
    sortField,
    sortOrder,
    actions,
    currentPage,
    totalPages,
    onPageChange,
    handleOpenModal,
    search,
    setSearch,toast, setToast, handleCloseModal, showModal, loading, handleDelete, handleFormSubmit, selectedMember, modalType
}) => {
    return (
        <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
            <motion.div
                className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-xl font-semibold text-gray-100'>Members List</h2>
                    <button
                        onClick={() => handleOpenModal("create-member")}
                        className='bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600'
                    >
                        Add Member
                    </button>
                </div>

                {/* Search */}
                <div className='relative mb-6'>
                    <input
                        type='text'
                        placeholder='Search members...'
                        className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className='absolute left-3 top-2.5 text-gray-400'>🔍</span> {/* Placeholder search icon */}
                </div>
                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.field}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                                        onClick={() => onSort(column.field)}
                                    >
                                        {column.label}{" "}
                                        {sortField === column.field
                                            ? sortOrder === "asc"
                                                ? "▲"
                                                : "▼"
                                            : ""}
                                    </th>
                                ))}
                                {actions && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {data.map((item) => (
                                <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                > 
                                    {columns.map((column) => (
                                        <td
                                            key={column.field}
                                            className="px-6 py-4 whitespace-nowrap"
                                        >
                                            {column.render
                                                ? column.render(item[column.field], item)
                                                : item[column.field]}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {actions.map((action, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => action.onClick(item)}
                                                    className={action.className}
                                                >
                                                    {action.label}
                                                </button>
                                            ))}
                                        </td>
                                    )}
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex justify-between items-center">
                    <button
                        onClick={() => onPageChange((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-300">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => onPageChange((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </motion.div>

            {/* Modal */}
            {showModal && (
                <Modal title={modalTitles[modalType]} onClose={handleCloseModal}>
                    {modalType === "edit-member" || modalType === "create-member" ? (
                        <DynamicForm
                            fields={columns}
                            onSubmit={handleFormSubmit}
                            initialValues={selectedMember || {}}
                            onCancel={handleCloseModal}
                        />
                    ) : (
                        <div>
                            <p>Are you sure you want to delete {selectedMember?.name}?</p>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={handleCloseModal}
                                    className="bg-gray-300 px-4 py-2 rounded"
                                    disabled={loading} // Disable during loading
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className={`px-4 py-2 rounded ${loading ? "bg-gray-400" : "bg-red-500 text-white"}`}
                                    disabled={loading} // Disable during loading
                                >
                                    {loading ? "Deleting..." : "Delete"} {/* Show a spinner or loading text */}
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>
            )}

            {/* Toast */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    isError={toast.isError}
                    onDismiss={() => setToast({ show: false, message: "", isError: false })}
                />
            )}    
        </main>
    );
};

export default DataTable;
