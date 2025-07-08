import React, { useContext } from "react";
import { UserContext } from "@/context/userContext";
import { useUserAuth } from "@/hooks/useUserAuth";
import SidebarLayout from "@/components/Layout/SidebarLayout";
import { USER_MENU_ITEMS } from "@/utils/data";
import Profile from "@/components/Profile";
// Menu items for the sidebar

const UserDashboard: React.FC = () => {
	useUserAuth();

	const context = useContext(UserContext);
	if (!context) {
		throw new Error("UserContext not found");
	}
	const { user, signout } = context;

	return (
		<SidebarLayout menuItems={USER_MENU_ITEMS} user={user} signout={signout}>
			<Profile />
		</SidebarLayout>
	);
};

export default UserDashboard;
