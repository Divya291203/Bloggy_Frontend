import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/themeContext";
import {
	FileText,
	Users,
	Eye,
	MessageSquare,
	TrendingUp,
	// Activity,
	AlertCircle,
	CheckCircle,
	Clock,
	Loader2,
	Calendar,
	BarChart3,
	Tag,
} from "lucide-react";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";

interface AdminDashboardViewProps {
	user?: { name?: string } | null;
	setActiveView: (view: string) => void;
}

type Stats = {
	totalPosts: number;
	totalPublishedPosts: number;
	totalDrafts: number;
	totalUsers: number;
	totalViews: number;
	totalComments: number;
	todaysStats: {
		publishedPostToday: number;
		totalDraftsToday: number;
		totalUsersCreatedToday: number;
		totalViewsToday: number;
	};
	weeklyStats: {
		publishedPostWeekly: number;
		totalDraftsWeekly: number;
		totalUsersCreatedWeekly: number;
		totalViewsWeekly: number;
	};
	monthlyStats: {
		publishedPostMonthly: number;
		totalDraftsMonthly: number;
		totalUsersCreatedMonthly: number;
		totalViewsMonthly: number;
	};
	categoryStats: {
		category: string;
		count: number;
	}[];
};

type TimePeriod = "today" | "weekly" | "monthly";
const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
	user,
	setActiveView,
}) => {
	const { adminColors } = useTheme();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	const [stats, setStats] = useState<Stats>({
		totalPosts: 0,
		totalViews: 0,
		totalPublishedPosts: 0,
		totalDrafts: 0,
		totalUsers: 0,
		totalComments: 0,
		todaysStats: {
			publishedPostToday: 0,
			totalDraftsToday: 0,
			totalUsersCreatedToday: 0,
			totalViewsToday: 0,
		},
		weeklyStats: {
			publishedPostWeekly: 0,
			totalDraftsWeekly: 0,
			totalUsersCreatedWeekly: 0,
			totalViewsWeekly: 0,
		},
		monthlyStats: {
			publishedPostMonthly: 0,
			totalDraftsMonthly: 0,
			totalUsersCreatedMonthly: 0,
			totalViewsMonthly: 0,
		},
		categoryStats: [],
	});

	const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("today");

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setLoading(true);
				const [
					responsePosts,
					responseUsers,
					responseComments,
					responseTodaysStats,
					responseWeeklyStats,
					responseMonthlyStats,
					responseCategoryStats,
				] = await Promise.all([
					axiosInstance.get(API_PATHS.STATS.GET_TOTAL_POSTS),
					axiosInstance.get(API_PATHS.STATS.GET_TOTAL_USERS),
					axiosInstance.get(API_PATHS.STATS.GET_TOTAL_COMMENTS),
					axiosInstance.get(API_PATHS.STATS.GET_TODAYS_STATS),
					axiosInstance.get(API_PATHS.STATS.GET_WEEKLY_STATS),
					axiosInstance.get(API_PATHS.STATS.GET_MONTHLY_STATS),
					axiosInstance.get(API_PATHS.STATS.GET_CATEGORY_STATS),
				]);

				// Extract totalViews correctly from aggregation result
				const totalViews = responsePosts.data.totalViews;

				// Extract time-based views correctly
				const totalViewsToday = responseTodaysStats.data.totalViewsToday;
				const totalViewsWeekly = responseWeeklyStats.data.totalViewsWeekly;
				const totalViewsMonthly = responseMonthlyStats.data.totalViewsMonthly;

				setStats({
					totalPosts: responsePosts.data.totalPosts,
					totalPublishedPosts: responsePosts.data.totalPublishedPosts,
					totalDrafts: responsePosts.data.totalDrafts,
					totalUsers: responseUsers.data.totalUsers,
					totalComments: responseComments.data.totalComments,
					totalViews,
					todaysStats: {
						publishedPostToday: responseTodaysStats.data.publishedPostToday,
						totalDraftsToday: responseTodaysStats.data.totalDraftsToday,
						totalUsersCreatedToday:
							responseTodaysStats.data.totalUsersCreatedToday,
						totalViewsToday,
					},
					weeklyStats: {
						publishedPostWeekly: responseWeeklyStats.data.publishedPostWeekly,
						totalDraftsWeekly: responseWeeklyStats.data.totalDraftsWeekly,
						totalUsersCreatedWeekly:
							responseWeeklyStats.data.totalUsersCreatedWeekly,
						totalViewsWeekly,
					},
					monthlyStats: {
						publishedPostMonthly:
							responseMonthlyStats.data.publishedPostMonthly,
						totalDraftsMonthly: responseMonthlyStats.data.totalDraftsMonthly,
						totalUsersCreatedMonthly:
							responseMonthlyStats.data.totalUsersCreatedMonthly,
						totalViewsMonthly,
					},
					categoryStats: responseCategoryStats.data.categoryStats,
				});
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

	// Helper functions to get current period stats safely
	const getCurrentPeriodPublished = () => {
		switch (selectedPeriod) {
			case "today":
				return stats.todaysStats.publishedPostToday;
			case "weekly":
				return stats.weeklyStats.publishedPostWeekly;
			case "monthly":
				return stats.monthlyStats.publishedPostMonthly;
			default:
				return stats.todaysStats.publishedPostToday;
		}
	};

	const getCurrentPeriodDrafts = () => {
		switch (selectedPeriod) {
			case "today":
				return stats.todaysStats.totalDraftsToday;
			case "weekly":
				return stats.weeklyStats.totalDraftsWeekly;
			case "monthly":
				return stats.monthlyStats.totalDraftsMonthly;
			default:
				return stats.todaysStats.totalDraftsToday;
		}
	};

	const getCurrentPeriodUsers = () => {
		switch (selectedPeriod) {
			case "today":
				return stats.todaysStats.totalUsersCreatedToday;
			case "weekly":
				return stats.weeklyStats.totalUsersCreatedWeekly;
			case "monthly":
				return stats.monthlyStats.totalUsersCreatedMonthly;
			default:
				return stats.todaysStats.totalUsersCreatedToday;
		}
	};
	// Helper function to format period display
	const getPeriodDisplay = () => {
		switch (selectedPeriod) {
			case "today":
				return "Today";
			case "weekly":
				return "This Week";
			case "monthly":
				return "This Month";
			default:
				return "Today";
		}
	};
	const [catagoryAll, setCatagoryAll] = useState<boolean>(false);
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
						your platform.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Calendar className="h-5 w-5 text-muted-foreground" />
					<select
						value={selectedPeriod}
						onChange={(e) => setSelectedPeriod(e.target.value as TimePeriod)}
						className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
					>
						<option value="today">Today</option>
						<option value="weekly">This Week</option>
						<option value="monthly">This Month</option>
					</select>
				</div>
			</div>

			{/* Key Metrics */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/30">
					<div className="flex items-center justify-between">
						<div className="space-y-3">
							<p className="text-sm font-medium text-muted-foreground">
								Total Posts
							</p>
							<p className="text-3xl font-bold text-foreground">
								{stats.totalPosts?.toLocaleString()}
							</p>
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
									<TrendingUp className="h-3 w-3" />
									+12%
								</div>
								<span className="text-xs text-muted-foreground">
									from last month
								</span>
							</div>
						</div>
						<div className="relative">
							<div
								className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
								style={{ backgroundColor: colors.stats.posts }}
							>
								<FileText className="h-6 w-6 text-white" />
							</div>
							<div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full animate-pulse" />
						</div>
					</div>
					<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				</div>

				<div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/30">
					<div className="flex items-center justify-between">
						<div className="space-y-3">
							<p className="text-sm font-medium text-muted-foreground">
								Total Users
							</p>
							<p className="text-3xl font-bold text-foreground">
								{stats.totalUsers?.toLocaleString()}
							</p>
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
									<TrendingUp className="h-3 w-3" />
									+8%
								</div>
								<span className="text-xs text-muted-foreground">
									from last month
								</span>
							</div>
						</div>
						<div className="relative">
							<div
								className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
								style={{ backgroundColor: colors.stats.users }}
							>
								<Users className="h-6 w-6 text-white" />
							</div>
							<div className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 rounded-full animate-pulse" />
						</div>
					</div>
					<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				</div>

				<div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/30">
					<div className="flex items-center justify-between">
						<div className="space-y-3">
							<p className="text-sm font-medium text-muted-foreground">
								Total Views
							</p>
							<p className="text-3xl font-bold text-foreground">
								{stats.totalViews?.toLocaleString()}
							</p>
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">
									<Eye className="h-3 w-3" />
									Live
								</div>
								<span className="text-xs text-muted-foreground">
									real-time data
								</span>
							</div>
						</div>
						<div className="relative">
							<div
								className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
								style={{ backgroundColor: colors.stats.views }}
							>
								<Eye className="h-6 w-6 text-white" />
							</div>
							<div className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 rounded-full animate-pulse" />
						</div>
					</div>
					<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				</div>

				<div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/30">
					<div className="flex items-center justify-between">
						<div className="space-y-3">
							<p className="text-sm font-medium text-muted-foreground">
								Total Comments
							</p>
							<p className="text-3xl font-bold text-foreground">
								{stats.totalComments?.toLocaleString()}
							</p>
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-full">
									<MessageSquare className="h-3 w-3" />
									Active
								</div>
								<span className="text-xs text-muted-foreground">
									engagement
								</span>
							</div>
						</div>
						<div className="relative">
							<div
								className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
								style={{ backgroundColor: colors.stats.comments }}
							>
								<MessageSquare className="h-6 w-6 text-white" />
							</div>
							<div className="absolute -top-1 -right-1 h-4 w-4 bg-purple-500 rounded-full animate-pulse" />
						</div>
					</div>
					<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				</div>
			</div>

			{/* Time Period Stats */}
			<div className="rounded-lg border bg-card p-6 shadow-sm">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-lg font-semibold">
						{getPeriodDisplay()} Statistics
					</h3>
					<BarChart3 className="h-5 w-5 text-muted-foreground" />
				</div>
				<div className="grid gap-3 md:grid-cols-3">
					<div className="text-center">
						<div className="flex items-center justify-center mb-2">
							<div
								className="rounded-full p-2"
								style={{ backgroundColor: `${colors.status.approved}20` }}
							>
								<CheckCircle
									className="h-5 w-5"
									style={{ color: colors.status.approved }}
								/>
							</div>
						</div>
						<p className="text-2xl font-bold">{getCurrentPeriodPublished()}</p>
						<p className="text-sm text-muted-foreground">Published Posts</p>
					</div>

					<div className="text-center">
						<div className="flex items-center justify-center mb-2">
							<div
								className="rounded-full p-2"
								style={{ backgroundColor: `${colors.status.pending}20` }}
							>
								<Clock
									className="h-5 w-5"
									style={{ color: colors.status.pending }}
								/>
							</div>
						</div>
						<p className="text-2xl font-bold">{getCurrentPeriodDrafts()}</p>
						<p className="text-sm text-muted-foreground">Drafts Created</p>
					</div>

					<div className="text-center">
						<div className="flex items-center justify-center mb-2">
							<div
								className="rounded-full p-2"
								style={{ backgroundColor: `${colors.stats.users}20` }}
							>
								<Users
									className="h-5 w-5"
									style={{ color: colors.stats.users }}
								/>
							</div>
						</div>
						<p className="text-2xl font-bold">{getCurrentPeriodUsers()}</p>
						<p className="text-sm text-muted-foreground">New Users</p>
					</div>
				</div>
			</div>

			{/* Category Statistics */}
			<div className="rounded-lg border bg-card p-6 shadow-sm">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-lg font-semibold">Content Categories</h3>
					<Tag className="h-5 w-5 text-muted-foreground" />
				</div>
				<div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
					{stats.categoryStats
						.sort((a, b) => b.count - a.count)
						.slice(0, catagoryAll ? stats.categoryStats.length : 9)
						.map((category) => (
							<div
								key={category.category}
								className="flex items-center justify-between p-3 rounded-md bg-muted/50 hover:bg-muted/80 transition-colors"
							>
								<div className="flex items-center gap-2">
									<div className="h-2 w-2 rounded-full bg-primary" />
									<span className="text-sm font-medium">
										{category.category}
									</span>
								</div>
								<span className="text-sm font-bold text-primary">
									{category.count}
								</span>
							</div>
						))}
				</div>
				{stats.categoryStats.length > 9 && !catagoryAll && (
					<div className="mt-4 text-center">
						<button
							className="text-sm text-primary hover:text-primary/80 transition-colors"
							onClick={() => setCatagoryAll(true)}
						>
							View All Categories ({stats.categoryStats.length})
						</button>
					</div>
				)}
				{catagoryAll && (
					<div className="mt-4 text-center">
						<button
							className="text-sm text-primary hover:text-primary/80 transition-colors"
							onClick={() => setCatagoryAll(false)}
						>
							View Less Categories
						</button>
					</div>
				)}
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
							<p className="font-semibold">Draft Posts</p>
							<p className="text-sm text-muted-foreground">
								{stats.totalDrafts} posts need review
							</p>
						</div>
					</div>
					<button
						className="mt-4 w-full rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
						style={{ backgroundColor: colors.status.pending }}
						onClick={() => setActiveView("Drafts")}
					>
						Review Drafts
					</button>
				</div>

				<div className="rounded-lg border bg-card p-6 shadow-sm">
					<div className="flex items-center gap-3">
						<div
							className="rounded-full p-2"
							style={{ backgroundColor: `${colors.stats.users}20` }}
						>
							<Users
								className="h-5 w-5"
								style={{ color: colors.stats.users }}
							/>
						</div>
						<div>
							<p className="font-semibold">User Management</p>
							<p className="text-sm text-muted-foreground">
								Manage {stats.totalUsers} users
							</p>
						</div>
					</div>
					<button
						className="mt-4 w-full rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
						style={{ backgroundColor: colors.stats.users }}
						onClick={() => setActiveView("Users")}
					>
						Manage Users
					</button>
				</div>

				{/* <div className="rounded-lg border bg-card p-6 shadow-sm">
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
					<button
						className="mt-4 w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
						onClick={() => setActiveView("System Health")}
					>
						View Details
					</button>
				</div> */}
			</div>
		</div>
	);
};

export default AdminDashboardView;
