import { UserContext } from "@/context/userContext";
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "@/components/Loading";

interface PrivateRouteProps {
	allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
	allowedRoles = ["reader", "author", "admin"],
}) => {
	const context = useContext(UserContext);

	if (!context) {
		throw new Error("UserContext not found");
	}

	const { user, loading } = context;

	// Show loading while checking authentication
	if (loading) {
		return <Loading message="Checking authentication..." />;
	}

	// Redirect to login if no user
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	// Check if user has allowed role
	if (allowedRoles.includes(user.role)) {
		return <Outlet />;
	}

	// Redirect to login if user doesn't have required role
	return <Navigate to="/login" replace />;
};

export default PrivateRoute;
