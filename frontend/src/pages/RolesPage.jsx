import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Modal from "../components/modal/modal"; 
import DynamicForm from "../components/shared/dynamicForms";
import Header from "../components/common/Header";
import Toast from "../components/common/toast"; 
import axiosInstance from "../axiosInstanceJson";

const MemberTable = () => {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [selectedMember, setSelectedMember] = useState(null);
	const [reloadMembers, setReloadMembers] = useState(false); // Trigger for reloading members
    const [toast, setToast] = useState({ show: false, message: "", isError: false });
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 5;

    // Fetch members from the backend
    useEffect(() => {
		const fetchMembers = async () => {
			setLoading(true); // Start loading
			try {
				const response = await axiosInstance.get("/roles"); // Use axiosInstance
				setMembers(response.data.roles);
			} catch (error) {
				console.error("Error fetching members:", error);
				setToast({ show: true, message: "Error fetching members", isError: true });
			} finally {
				setLoading(false); // Stop loading
			}
		};

		fetchMembers();
	}, [reloadMembers]); // Re-run when reloadMembers changes

    // Filter and sort members
    useEffect(() => {
        let sortedMembers = [...members];

        // Filter
        if (search) {
            sortedMembers = sortedMembers.filter((member) =>
                member.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Sort
        sortedMembers.sort((a, b) => {
            if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
            if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        setFilteredMembers(sortedMembers);
    }, [members, search, sortField, sortOrder]);

    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    const paginatedMembers = filteredMembers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

	const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    // Open and close modal
    const handleOpenModal = (type, member = null) => {
        setModalType(type);
        setSelectedMember(member);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalType("");
        setSelectedMember(null);
    };

    const modalTitles = {
        "create-role": "Create Role",
        "edit-role": "Edit Role",
		"delete-role": "Delete role"
    };

    // Delete member
	const handleDelete = async () => {
		setLoading(true);
		try {
			// Use axiosInstance for DELETE request
			await axiosInstance.delete(`/roles/${selectedMember.id}`);
	
			// Update the members state
			setMembers(members.filter((member) => member.id !== selectedMember.id));
			setShowModal(false);
			setReloadMembers((prev) => !prev); // Toggle reloadMembers to trigger useEffect
			setToast({ show: true, message: "Role deleted successfully", isError: false });
		} catch (error) {
			console.error("Error deleting role:", error);
			setToast({ show: true, message: "Error deleting role", isError: true });
		} finally {
			setLoading(false);
		}
	};


    // Form submission for create and edit
	const handleFormSubmit = async (formData) => {
		try {
			const endpoint =
				modalType === "create-role"
					? "/roles"
					: `/roles/${selectedMember.id}`;
			const method = modalType === "create-role" ? axiosInstance.post : axiosInstance.put;
	
			await method(endpoint, formData);
	
			setToast({ show: true, message: "Role saved successfully", isError: false });
			setReloadMembers((prev) => !prev); // Toggle reloadMembers to trigger useEffect
			handleCloseModal(); // Close the modal
		} catch (error) {
			console.error("Error saving member:", error);
			setToast({ show: true, message: "Error saving member", isError: true });
		}
	};


    // Field configurations
    const memberFields = [
        { name: "name", label: "Name", type: "text", required: true },
		{ name: "description", label: "Description", type: "text", required: true }, 
    ];

    return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Members' />
			{loading ? (
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
				</div>
			) : (
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
								onClick={() => handleOpenModal("create-role")}
								className='bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600'
							>
								Add Role
							</button>
						</div>

						{/* Search */}
						<div className='relative mb-6'>
							<input
								type='text'
								placeholder='Search roles...'
								className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<span className='absolute left-3 top-2.5 text-gray-400'>🔍</span> {/* Placeholder search icon */}
						</div>

						{/* Table */}
						<div className='overflow-x-auto'>
							<table className='min-w-full divide-y divide-gray-700'>
								<thead>
									<tr>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer' onClick={() => handleSort("name")}>
											Name {sortField === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer'>
											Description 
										</th>
		
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer' onClick={() => handleSort("name")}> 
											Created At {sortField === "createdAt" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
											Actions
										</th>
									</tr>
								</thead>
								<tbody className='divide-y divide-gray-700'>
									{paginatedMembers.map((member) => (
										<motion.tr
											key={member.id}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ duration: 0.3 }}
										>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-300'>{member.name}</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-300'>{member.description}</div>
											</td>
											
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-300'>{member.createdAt}</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap flex gap-2'>
												<button
													onClick={() => handleOpenModal("edit-role", member)}
													className='text-indigo-400 hover:text-indigo-300'
												>
													Edit
												</button>
												<button
													onClick={() => handleOpenModal("delete-role", member)}
													className='text-red-400 hover:text-red-300'
												>
													Delete
												</button>
											</td>
										</motion.tr>
									))}
								</tbody>
							</table>
						</div>

						{/* Pagination */}
						<div className='mt-6 flex justify-between items-center'>
							<button
								onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
								disabled={currentPage === 1}
								className='px-4 py-2 bg-gray-700 text-gray-400 rounded-lg disabled:opacity-50'
							>
								Previous
							</button>
							<div className='text-sm text-gray-300'>
								Page {currentPage} of {totalPages}
							</div>
							<button
								onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
								disabled={currentPage === totalPages}
								className='px-4 py-2 bg-gray-700 text-gray-400 rounded-lg disabled:opacity-50'
							>
								Next
							</button>
						</div>
					</motion.div>


					{/* Modal */}
					{showModal && (
						<Modal title={modalTitles[modalType]} onClose={handleCloseModal}>
							{modalType === "edit-role" || modalType === "create-role" ? (
								<DynamicForm
									fields={memberFields}
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
			)}
        </div>
    );
};

export default MemberTable;
