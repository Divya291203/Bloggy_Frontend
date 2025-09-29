import { useUserAuth } from "@/hooks/useUserAuth";
import React, { useState } from "react";
import SidebarLayout from "@/components/Layout/SidebarLayout";
import { AUTHOR_MENU_ITEMS } from "@/utils/data";
import CreatePost from "@/components/CreatePost";
import Profile from "@/components/Profile";
import MyPosts from "@/components/MyPosts";
import CommentList from "@/components/CommentList";
import AuthorDashboardView from "@/components/AuthorDashboardView";
import EditPost from "@/components/EditPost";
import { usePostEditor } from "@/hooks/usePostEditor";
import AIPostCreationList, {
	type AIPostIdea,
} from "@/components/AIPostCreationList";

const AuthorDashboard: React.FC = () => {
	const [activeView, setActiveView] = useState("Dashboard");
	const { editingPostId, setEditingPostId } = usePostEditor();
	const { user, signout } = useUserAuth();
	const [idea, setIdea] = useState<AIPostIdea | null>(null);

	const handleIdea = (idea: AIPostIdea) => {
		setIdea(idea);
	};

	const handleEditPost = (postId: string) => {
		setEditingPostId(postId);
		setActiveView("Edit Post");
	};

	const renderActiveComponent = () => {
		switch (activeView) {
			case "Create Post":
				return (
					<div className="flex flex-1 flex-row gap-6 p-6">
						<CreatePost
							className="flex flex-2 flex-col gap-6 p-6"
							idea={idea || null}
						/>
						<AIPostCreationList onIdea={handleIdea} />
					</div>
				);
			case "My Posts":
				return <MyPosts onEditPost={handleEditPost} />;
			case "Comments":
				return <CommentList />;
			case "Profile":
				return <Profile />;
			case "Edit Post":
				return <EditPost initialPostId={editingPostId} />;
			case "Dashboard":
			default:
				return <AuthorDashboardView user={user || undefined} />;
		}
	};

	return (
		<SidebarLayout
			menuItems={AUTHOR_MENU_ITEMS}
			user={user}
			signout={signout}
			activeView={activeView}
			onViewChange={setActiveView}
		>
			{renderActiveComponent()}
		</SidebarLayout>
	);
};

export default AuthorDashboard;
