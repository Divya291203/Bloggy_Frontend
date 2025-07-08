import { API_PATHS } from "@/utils/apiPaths";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import {
	Search,
	Cpu,
	Code,
	Smartphone,
	Palette,
	Briefcase,
	TrendingUp,
	Heart,
	Plane,
	UtensilsCrossed,
	Activity,
	GraduationCap,
	Film,
	Newspaper,
	MoreHorizontal,
	Network,
} from "lucide-react";
import { Link } from "react-router-dom";

type CategoryStat = {
	category: string;
	count: number;
};

// Category metadata with icons and descriptions
const CATEGORY_METADATA: Record<
	string,
	{
		icon: React.ComponentType<{ className?: string }>;
		description: string;
		color: string;
	}
> = {
	Technology: {
		icon: Cpu,
		description:
			"Explore the latest technological innovations, gadgets, and digital trends shaping our future.",
		color: "text-blue-500",
	},
	Programming: {
		icon: Code,
		description:
			"Dive into coding tutorials, programming languages, and software development best practices.",
		color: "text-green-500",
	},
	"Web Development": {
		icon: Network,
		description:
			"Learn about modern web technologies, frameworks, and front-end/back-end development.",
		color: "text-purple-500",
	},
	"Mobile Development": {
		icon: Smartphone,
		description:
			"Discover mobile app development, iOS/Android programming, and cross-platform solutions.",
		color: "text-orange-500",
	},
	Design: {
		icon: Palette,
		description:
			"Explore UI/UX design principles, visual aesthetics, and creative design processes.",
		color: "text-pink-500",
	},
	Business: {
		icon: Briefcase,
		description:
			"Insights into entrepreneurship, business strategies, and corporate management.",
		color: "text-indigo-500",
	},
	Marketing: {
		icon: TrendingUp,
		description:
			"Digital marketing strategies, content marketing, and brand building techniques.",
		color: "text-cyan-500",
	},
	Lifestyle: {
		icon: Heart,
		description:
			"Tips for personal development, wellness, productivity, and work-life balance.",
		color: "text-red-500",
	},
	Anime: {
		icon: Film,
		description:
			"Reviews, discussions, and insights into the world of anime and manga culture.",
		color: "text-violet-500",
	},
	Travel: {
		icon: Plane,
		description:
			"Travel guides, destination reviews, and adventures from around the globe.",
		color: "text-emerald-500",
	},
	Food: {
		icon: UtensilsCrossed,
		description:
			"Culinary adventures, recipes, restaurant reviews, and food culture exploration.",
		color: "text-amber-500",
	},
	Health: {
		icon: Activity,
		description:
			"Health tips, fitness routines, mental wellness, and medical insights.",
		color: "text-teal-500",
	},
	Education: {
		icon: GraduationCap,
		description:
			"Educational resources, learning techniques, and academic insights.",
		color: "text-blue-600",
	},
	Entertainment: {
		icon: Film,
		description:
			"Movies, TV shows, games, and entertainment industry news and reviews.",
		color: "text-purple-600",
	},
	News: {
		icon: Newspaper,
		description:
			"Current events, breaking news, and analysis of global developments.",
		color: "text-gray-500",
	},
	Other: {
		icon: MoreHorizontal,
		description:
			"Miscellaneous topics and diverse content that doesn't fit other categories.",
		color: "text-slate-500",
	},
};

const Topics: React.FC = () => {
	const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCategoryStats = async () => {
			try {
				setLoading(true);
				const response = await axiosInstance.get(
					API_PATHS.STATS.GET_CATEGORY_STATS
				);
				setCategoryStats(response.data.categoryStats);
			} catch (error) {
				console.error("API Error:", error);
				setError(`Failed to fetch category stats: ${error}`);
			} finally {
				setLoading(false);
			}
		};
		fetchCategoryStats();
	}, []);

	if (loading) {
		return <Loading message="Loading topics..." fullScreen />;
	}

	if (error) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<p className="text-destructive mb-4">Error loading topics</p>
					<Button onClick={() => window.location.reload()} variant="outline">
						Try Again
					</Button>
				</div>
			</div>
		);
	}

	// Filter out categories with 0 articles and sort by count
	const filteredStats = categoryStats
		.filter((stat) => stat.count >= 0)
		.sort((a, b) => b.count - a.count);

	return (
		<div className="min-h-screen bg-background">
			{/* Header Section */}
			<div className="container mx-auto px-4 py-16">
				<div className="text-center mb-12">
					<h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
						Topics
					</h1>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Discover amazing content across various categories. From technology
						and programming to lifestyle and entertainment, find topics that
						interest you.
					</p>
				</div>

				{/* Topics Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredStats.map((stat) => {
						const metadata =
							CATEGORY_METADATA[stat.category] || CATEGORY_METADATA["Other"];
						const IconComponent = metadata.icon;

						return (
							<Card
								key={stat.category}
								className="group bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
							>
								<CardContent className="p-6">
									<div className="flex items-start justify-between mb-4">
										<div
											className={`p-3 rounded-lg bg-primary/10 ${metadata.color}`}
										>
											<IconComponent className="h-6 w-6" />
										</div>
										<span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
											{stat.count} article{stat.count !== 1 ? "s" : ""}
										</span>
									</div>

									<h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
										{stat.category}
									</h3>

									<p className="text-muted-foreground text-sm leading-relaxed mb-4">
										{metadata.description}
									</p>

									<Link
										to={`/post?category=${encodeURIComponent(stat.category)}`}
										className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium text-sm"
									>
										View articles
										<span className="ml-1 group-hover:translate-x-1 transition-transform">
											→
										</span>
									</Link>
								</CardContent>
							</Card>
						);
					})}
				</div>

				{filteredStats.length === 0 && (
					<div className="text-center py-16">
						<div className="mb-4">
							<Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
						</div>
						<h3 className="text-xl font-semibold text-foreground mb-2">
							No Topics Found
						</h3>
						<p className="text-muted-foreground">
							There are no published articles yet. Check back later for exciting
							content!
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Topics;
