import { Route, Routes, Navigate, useLocation } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";

import OverviewPage from "./pages/OverviewPage";
import Members from "./pages/Members";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import LoginForm from "./components/authentication/Login";
import RegisterForm from "./components/authentication/Register";

// Utility to check authentication (replace with real auth check logic)
const isAuthenticated = () => {
    return !!localStorage.getItem("authToken"); // Example: Check for a token in localStorage
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    const location = useLocation(); // Get the current location

    // Define paths where the sidebar should not be shown
    const excludedPaths = ["/login", "/register"];
    const shouldShowSidebar = !excludedPaths.includes(location.pathname);

    return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			{/* Background */}
			{/* <div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div> */}

            {isAuthenticated() && shouldShowSidebar && <Sidebar />}

            <div className="flex-1 overflow-auto">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />

                    {/* Protected Routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <OverviewPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/members"
                        element={
                            <ProtectedRoute>
                                <Members />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute>
                                <UsersPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute>
                                <SettingsPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </div>
    );
}

export default App;
