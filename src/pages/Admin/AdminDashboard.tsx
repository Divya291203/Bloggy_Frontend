import React, { useState } from "react";
import SidebarLayout from "@/components/Layout/SidebarLayout";
import { ADMIN_MENU_ITEMS } from "@/utils/data";
// Import your components
import CreatePost from "@/components/CreatePost";
import MyPosts from "@/components/MyPosts";
import PostList from "@/components/PostList";
import UserList from "@/components/UserList";
import CommentList from "@/components/CommentList";
import Profile from "@/components/Profile";
import AdminDashboardView from "@/components/AdminDashboardView";
import { useUserAuth } from "@/hooks/useUserAuth";
import EditPost from "@/components/EditPost";
import { usePostEditor } from "@/hooks/usePostEditor";

const AdminDashboard: React.FC = () => {
	const [activeView, setActiveView] = useState("Dashboard");
	const { editingPostId, setEditingPostId } = usePostEditor();
	const { user, signout } = useUserAuth();

	const handleEditPost = (postId: string) => {
		setEditingPostId(postId);
		setActiveView("Edit Post");
	};

	// Component mapping for different views
	const renderActiveComponent = () => {
		switch (activeView) {
			case "Create Post":
				return <CreatePost className="flex flex-1 flex-col gap-6 p-6" />;
			case "My Posts":
				return (
					<MyPosts
						className="flex flex-1 flex-col gap-6 p-6"
						onEditPost={handleEditPost}
					/>
				);
			case "Edit Post":
				return (
					<EditPost
						className="flex flex-1 flex-col gap-6 p-6"
						initialPostId={editingPostId}
					/>
				);
			case "All Posts":
				return (
					<PostList
						className="flex flex-1 flex-col gap-6 p-6"
						onEditPost={handleEditPost}
					/>
				);
			case "All Users":
				return <UserList className="flex flex-1 flex-col gap-6 p-6" />;
			case "Comments":
				return <CommentList className="flex flex-1 flex-col gap-6 p-6" />;
			case "Profile":
				return <Profile className="flex flex-1 flex-col gap-6 p-6" />;
			case "Dashboard":
			default:
				return <AdminDashboardView user={user || undefined} />;
		}
	};

	return (
		<SidebarLayout
			menuItems={ADMIN_MENU_ITEMS}
			user={user}
			signout={signout}
			activeView={activeView}
			onViewChange={setActiveView}
		>
			{renderActiveComponent()}
		</SidebarLayout>
	);
};

export default AdminDashboard;
