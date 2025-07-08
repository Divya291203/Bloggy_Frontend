import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/themeContext";
import {
	FileText,
	Users,
	Eye,
	MessageSquare,
	TrendingUp,
	Activity,
	AlertCircle,
	CheckCircle,
	Clock,
	Loader2,
} from "lucide-react";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";

interface AdminDashboardViewProps {
	user?: { name?: string };
}

type Stats = {
	totalPosts: number;
	totalPublishedPosts: number;
	totalDrafts: number;
	totalUsers: number;
	totalViews?: number;
	totalComments?: number;
	pendingPosts?: number;
	publishedToday?: number;
};
const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ user }) => {
	const { adminColors } = useTheme();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	// Mock data - replace with real API calls
	const [stats, setStats] = useState<Stats>({
		totalPosts: 0,
		totalPublishedPosts: 0,
		totalDrafts: 0,
		totalUsers: 0,
		totalViews: 0,
		totalComments: 0,
		pendingPosts: 0,
		publishedToday: 0,
	});

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setLoading(true);
				const responsePosts = await axiosInstance.get(
					API_PATHS.STATS.GET_TOTAL_POSTS
				);
				const responseUsers = await axiosInstance.get(
					API_PATHS.STATS.GET_TOTAL_USERS
				);
				const responseComments = await axiosInstance.get(
					API_PATHS.STATS.GET_TOTAL_COMMENTS
				);
				const responsePublishedToday = await axiosInstance.get(
					API_PATHS.STATS.GET_PUBLISHED_TODAY
				);
				setStats((prev) => ({
					...prev,
					totalPosts: responsePosts.data.totalPosts,
					totalPublishedPosts: responsePosts.data.totalPublishedPosts,
					totalDrafts: responsePosts.data.totalDrafts,
					totalUsers: responseUsers.data.totalUsers,
					totalComments: responseComments.data.totalComments,
					publishedToday: responsePublishedToday.data.publishedToday,
					totalViews: 0, // Set default value since it's not from API
					pendingPosts: 0, // Set default value since it's not from API
				}));
			} catch (error) {
				setError(error as Error);
			} finally {
				setLoading(false);
			}
		};
		fetchStats();
	}, []);

	// Get theme-aware colors
	const colors = adminColors;
	console.log(stats);

	return (
		<div className="flex flex-1 flex-col gap-6 p-6">
			{loading && (
				<div className="flex items-center justify-center h-screen">
					<Loader2 className="h-10 w-10 animate-spin" />
				</div>
			)}
			{error && (
				<div className="flex items-center justify-center h-screen">
					<AlertCircle className="h-10 w-10 text-red-500" />
				</div>
			)}
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
					<p className="text-muted-foreground">
						Welcome back, {user?.name || "Admin"}! Here's what's happening with
						your platform today.
					</p>
				</div>
			</div>

			{/* Key Metrics */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<div className="rounded-lg border bg-card p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Total Posts
							</p>
							<p className="text-2xl font-bold">{stats.totalPosts}</p>
							<p className="text-xs text-green-600 flex items-center gap-1">
								<TrendingUp className="h-3 w-3" />
								+12% from last month
							</p>
						</div>
						<div
							className="h-8 w-8 rounded-lg flex items-center justify-center"
							style={{ backgroundColor: colors.stats.posts }}
						>
							<FileText className="h-5 w-5 text-white" />
						</div>
					</div>
				</div>

				<div className="rounded-lg border bg-card p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Total Users
							</p>
							<p className="text-2xl font-bold">{stats.totalUsers}</p>
							<p className="text-xs text-green-600 flex items-center gap-1">
								<TrendingUp className="h-3 w-3" />
								+8% from last month
							</p>
						</div>
						<div
							className="h-8 w-8 rounded-lg flex items-center justify-center"
							style={{ backgroundColor: colors.stats.users }}
						>
							<Users className="h-5 w-5 text-white" />
						</div>
					</div>
				</div>

				<div className="rounded-lg border bg-card p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Total Views
							</p>
							<p className="text-2xl font-bold">{stats.totalViews}</p>
							<p className="text-xs text-green-600 flex items-center gap-1">
								<TrendingUp className="h-3 w-3" />
								+23% from last month
							</p>
						</div>
						<div
							className="h-8 w-8 rounded-lg flex items-center justify-center"
							style={{ backgroundColor: colors.stats.views }}
						>
							<Eye className="h-5 w-5 text-white" />
						</div>
					</div>
				</div>

				<div className="rounded-lg border bg-card p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Comments
							</p>
							<p className="text-2xl font-bold">{stats.totalComments}</p>
							<p className="text-xs text-green-600 flex items-center gap-1">
								<TrendingUp className="h-3 w-3" />
								+5% from last month
							</p>
						</div>
						<div
							className="h-8 w-8 rounded-lg flex items-center justify-center"
							style={{ backgroundColor: colors.stats.comments }}
						>
							<MessageSquare className="h-5 w-5 text-white" />
						</div>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid gap-4 md:grid-cols-3">
				<div className="rounded-lg border bg-card p-6 shadow-sm">
					<div className="flex items-center gap-3">
						<div
							className="rounded-full p-2"
							style={{ backgroundColor: `${colors.status.pending}20` }}
						>
							<Clock
								className="h-5 w-5"
								style={{ color: colors.status.pending }}
							/>
						</div>
						<div>
							<p className="font-semibold">Pending Reviews</p>
							<p className="text-sm text-muted-foreground">
								{stats.totalDrafts} posts awaiting approval
							</p>
						</div>
					</div>
					<button
						className="mt-4 w-full rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
						style={{ backgroundColor: colors.status.pending }}
					>
						Review Posts
					</button>
				</div>

				<div className="rounded-lg border bg-card p-6 shadow-sm">
					<div className="flex items-center gap-3">
						<div
							className="rounded-full p-2"
							style={{ backgroundColor: `${colors.status.approved}20` }}
						>
							<CheckCircle
								className="h-5 w-5"
								style={{ color: colors.status.approved }}
							/>
						</div>
						<div>
							<p className="font-semibold">Published Today</p>
							<p className="text-sm text-muted-foreground">
								{stats.publishedToday} new posts went live
							</p>
						</div>
					</div>
					<button
						className="mt-4 w-full rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
						style={{ backgroundColor: colors.status.approved }}
					>
						View Posts
					</button>
				</div>

				<div className="rounded-lg border bg-card p-6 shadow-sm">
					<div className="flex items-center gap-3">
						<div className="rounded-full bg-blue-100 p-2">
							<Activity className="h-5 w-5 text-blue-600" />
						</div>
						<div>
							<p className="font-semibold">System Health</p>
							<p className="text-sm text-muted-foreground">
								All systems operational
							</p>
						</div>
					</div>
					<button className="mt-4 w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
						View Details
					</button>
				</div>
			</div>

			{/* Charts and Recent Activity */}
			{/* TODO: Charts and Recent Activity */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Chart Placeholder */}
				{/* <div className="rounded-lg border bg-card p-6 shadow-sm">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold">Analytics Overview</h3>
						<select className="rounded-md border border-border bg-background px-3 py-1 text-sm">
							<option>Last 7 days</option>
							<option>Last 30 days</option>
							<option>Last 3 months</option>
						</select>
					</div>
					<div className="h-64 rounded-md bg-muted/30 flex items-center justify-center">
						<div className="text-center">
							<TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
							<p className="text-sm text-muted-foreground">
								Chart will be displayed here
							</p>
							<p className="text-xs text-muted-foreground">
								Connect analytics library
							</p>
						</div>
					</div>
				</div> */}

				{/* <div className="rounded-lg border bg-card p-6 shadow-sm">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold">Recent Activity</h3>
						<button className="text-sm text-primary hover:text-primary/80 transition-colors">
							View All
						</button>
					</div>
					<div className="space-y-4">
						{recentActivities.map((activity) => (
							<div key={activity.id} className="flex items-start gap-3">
								<div
									className={`rounded-full p-1 ${
										activity.type === "user"
											? "bg-purple-100"
											: activity.type === "post"
											? "bg-blue-100"
											: activity.type === "report"
											? "bg-red-100"
											: "bg-yellow-100"
									}`}
								>
									{activity.type === "user" && (
										<Users className="h-3 w-3 text-purple-600" />
									)}
									{activity.type === "post" && (
										<FileText className="h-3 w-3 text-blue-600" />
									)}
									{activity.type === "report" && (
										<AlertCircle className="h-3 w-3 text-red-600" />
									)}
									{activity.type === "review" && (
										<Clock className="h-3 w-3 text-yellow-600" />
									)}
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium">{activity.action}</p>
									<p className="text-xs text-muted-foreground">
										{activity.user}
									</p>
								</div>
								<span className="text-xs text-muted-foreground">
									{activity.time}
								</span>
							</div>
						))}
					</div>
				</div> */}
			</div>
		</div>
	);
};

export default AdminDashboardView;
