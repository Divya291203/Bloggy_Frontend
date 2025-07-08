import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export const useUserAuth = () => {
	const context = useContext(UserContext);
	const navigate = useNavigate();
	if (!context) {
		throw new Error("useUserAuth must be used within a UserProvider");
	}
	const { user, loading, signout } = context;

	useEffect(() => {
		if (loading) return;
		if (user) return;

		if (!user) {
			signout();
			navigate("/login");
		}
	}, [user, loading, signout, navigate]);

	return { user, loading, signout };
};
