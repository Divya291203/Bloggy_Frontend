import React, { useEffect, useState } from "react";
import { Bookmark, FileText, Heart } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
interface AuthorDashboardViewProps {
	user?: { name?: string };
}

type Stats = {
	myPosts: number;
	favorites?: number;
	bookmarks?: number;
};

const AuthorDashboardView: React.FC<AuthorDashboardViewProps> = ({ user }) => {
	const [stats, setStats] = useState<Stats>({
		myPosts: 0,
		favorites: 0,
		bookmarks: 0,
	});

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await axiosInstance.get(
					API_PATHS.STATS.GET_TOTAL_AUTHOR_POSTS
				);
				setStats((prev) => ({
					...prev,
					myPosts: response.data.totalPosts,
				}));
			} catch (error) {
				console.error("Error fetching stats:", error);
			}
		};
		fetchStats();
	}, []);
	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			{/* TODO: create something with these divs */}
			{/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
				<div className="aspect-video rounded-xl bg-muted/50" />
				<div className="aspect-video rounded-xl bg-muted/50" />
				<div className="aspect-video rounded-xl bg-muted/50" />
			</div> */}
			<div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
				<div className="p-6">
					<h1 className="text-2xl font-bold">
						Welcome back, {user?.name || "User"}!
					</h1>
					<p className="text-muted-foreground mt-2">
						Here's an overview of your dashboard activity.
					</p>

					<div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<div className="rounded-lg border bg-card p-6">
							<div className="flex items-center gap-2">
								<FileText className="h-5 w-5 text-blue-600" />
								<h3 className="font-semibold">My Posts</h3>
							</div>
							<p className="text-2xl font-bold mt-2">{stats.myPosts}</p>
							<p className="text-sm text-muted-foreground">
								Published articles
							</p>
						</div>

						<div className="rounded-lg border bg-card p-6">
							<div className="flex items-center gap-2">
								<Heart className="h-5 w-5 text-red-600" />
								<h3 className="font-semibold">Favorites</h3>
							</div>
							<p className="text-2xl font-bold mt-2">{stats.favorites}</p>
							<p className="text-sm text-muted-foreground">Liked posts</p>
						</div>

						<div className="rounded-lg border bg-card p-6">
							<div className="flex items-center gap-2">
								<Bookmark className="h-5 w-5 text-green-600" />
								<h3 className="font-semibold">Bookmarks</h3>
							</div>
							<p className="text-2xl font-bold mt-2">{stats.bookmarks}</p>
							<p className="text-sm text-muted-foreground">Saved articles</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthorDashboardView;
