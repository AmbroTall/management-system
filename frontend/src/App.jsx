import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearError } from "../src/redux/authSlice";
import { isTokenExpired } from "./utils";
import {logout} from '../src/redux/authSlice'
import Sidebar from './components/common/Sidebar';
import OverviewPage from './pages/OverviewPage';
import Members from './pages/Members';
import RolesPage from './pages/RolesPage';
import LoginForm from './components/authentication/Login';
import RegisterForm from './components/authentication/Register';

const App = () => {
    const { token } = useSelector((state) => state.auth); // Authentication state
    const location = useLocation();
    const dispatch = useDispatch();
    const excludedPaths = ['/login', '/register'];
    const shouldShowSidebar = token && !excludedPaths.includes(window.location.pathname);
    useEffect(() => {
        // Clear error on every route change
        dispatch(clearError());
    }, [location, dispatch]);

    if (token && isTokenExpired(token)) {
        // Clear Redux store
        dispatch(logout()); 
    }

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">
            {shouldShowSidebar && <Sidebar />}
            <div className="flex-1 overflow-auto">
                <Routes>
                    {/* Redirect base path "/" to "/login" */}
                    <Route
                        path="/"
                        element={<Navigate to={token ? "/home" : "/login"} replace />}
                    />
                    {/* Redirect authenticated users from login and register */}
                    <Route
                        path="/login"
                        element={token ? <Navigate to="/home" replace /> : <LoginForm />}
                    />
                    <Route
                        path="/register"
                        element={token ? <Navigate to="/home" replace /> : <RegisterForm />}
                    />

                    {/* Protected Routes */}
                    <Route
                        path="/home"
                        element={token ? <OverviewPage /> : <Navigate to="/login" replace />}
                    />
                    <Route
                        path="/members"
                        element={token ? <Members /> : <Navigate to="/login" replace />}
                    />
                    <Route
                        path="/roles"
                        element={token ? <RolesPage /> : <Navigate to="/login" replace />}
                    />
                </Routes>
            </div>
        </div>
    );
};

export default App;
