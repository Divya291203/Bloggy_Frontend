import Hero from "@/components/Hero";
import PostCard from "@/components/PostCard";
import Loading from "@/components/Loading";
import usePosts from "@/hooks/usePosts";
import { API_PATHS } from "@/utils/apiPaths";
import { Link } from "react-router-dom";
import { useUser } from "@/context/userContext";

const Home: React.FC = () => {
	const { user } = useUser();

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section - Full Width */}
			<section className="w-full px-4 sm:px-6 lg:px-8 py-12 border-b border-border/20">
				<Hero />
			</section>

			{/* Show articles sections only if user is logged in */}
			{user ? <LoggedInContent /> : null}

			{/* Call-to-Action Section - Always show */}
			<section className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-background to-muted/20 border-t border-border/30">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
						Ready for More?
					</h2>
					<p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
						Discover hundreds of articles covering technology, development, and
						innovation.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<Link
							to={API_PATHS.POST.GET_ALL_POSTS}
							className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-3 rounded-md hover:bg-primary/90 transition-colors duration-200 font-medium shadow-sm text-center"
						>
							View All Articles
						</Link>
						<Link
							to={API_PATHS.POST.GET_ALL_POSTS}
							className="w-full sm:w-auto border border-border text-foreground px-8 py-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors duration-200 font-medium text-center"
						>
							Browse Topics
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};

// Separate component for logged-in content that will make API calls
const LoggedInContent: React.FC = () => {
	// Only fetch posts when this component is rendered (i.e., user is logged in)
	const {
		posts: featuredPosts,
		loading: featuredLoading,
		error: featuredError,
	} = usePosts({
		limit: 3,
		sortBy: "createdAt",
		order: "desc",
	});

	const {
		posts: recentPosts,
		loading: recentLoading,
		error: recentError,
	} = usePosts({
		page: 1,
		limit: 6,
		sortBy: "createdAt",
		order: "desc",
	});

	return (
		<>
			{/* Featured Articles Section */}
			<section className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-background relative">
				{/* Subtle top border accent */}
				<div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
							Featured Articles
						</h2>
						<p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
							Discover our latest and most popular content
						</p>
					</div>

					{featuredError && (
						<div className="text-red-500 text-center mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
							Error loading featured articles: {featuredError}
						</div>
					)}

					{featuredLoading ? (
						<Loading message="Loading featured articles..." />
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
							{featuredPosts.map((post) => (
								<PostCard key={post._id} post={post} type="featured" />
							))}
						</div>
					)}

					{/* View More Featured Articles Link */}
					{!featuredLoading && !featuredError && featuredPosts.length > 0 && (
						<div className="text-center mt-8">
							<Link
								to={API_PATHS.POST.GET_ALL_POSTS}
								className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
							>
								View More Articles
								<svg
									className="ml-2 w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</Link>
						</div>
					)}
				</div>
			</section>

			{/* Divider with dots */}
			<div className="w-full flex justify-center py-8">
				<div className="flex items-center gap-2">
					<div className="w-2 h-2 rounded-full bg-purple-500/30"></div>
					<div className="w-2 h-2 rounded-full bg-purple-500/50"></div>
					<div className="w-2 h-2 rounded-full bg-purple-500/30"></div>
				</div>
			</div>

			{/* Recent Articles Section */}
			<section className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-muted/20 to-muted/40 border-y border-border/20">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
							Recent Articles
						</h2>
						<p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
							Explore more of our latest content
						</p>
					</div>

					{recentError && (
						<div className="text-red-500 text-center mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
							Error loading recent articles: {recentError}
						</div>
					)}

					{recentLoading ? (
						<Loading message="Loading recent articles..." />
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
							{recentPosts.slice(0, 6).map((post) => (
								<PostCard key={post._id} post={post} type="normal" />
							))}
						</div>
					)}

					{/* View All Articles Link */}
					{!recentLoading && !recentError && recentPosts.length > 0 && (
						<div className="text-center mt-8">
							<Link
								to={API_PATHS.POST.GET_ALL_POSTS}
								className="inline-flex items-center px-6 py-3 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition-colors duration-200 font-medium"
							>
								Browse All Articles
								<svg
									className="ml-2 w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</Link>
						</div>
					)}
				</div>
			</section>
		</>
	);
};

export default Home;
