import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice"; // Import your logout action

const Header = ({ title }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// Handle logout
	const handleLogout = () => {
		dispatch(logout()); // Clear auth state in Redux
		navigate("/login"); // Redirect to login page
	};

	return (
		<header className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700'>
			<div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center'>
				<h1 className='text-2xl font-semibold text-gray-100'>{title}</h1>
				<button
					onClick={handleLogout}
					className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200'
				>
					Logout
				</button>
			</div>
		</header>
	);
};

export default Header;
