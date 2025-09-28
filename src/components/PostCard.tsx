import React from "react";
import {
	ArrowRight,
	Clock,
	Eye,
	Heart,
	MessageCircle,
	Calendar,
} from "lucide-react";
import type { userType } from "@/types/typeDef";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { API_PATHS } from "@/utils/apiPaths";

interface Post {
	userId: userType;
	_id: string;
	title: string;
	content: string;
	image: string;
	category: string;
	slug: string;
	createdAt: string;
	views?: number;
	likes?: number;
	comments?: number;
}

type PostCardProps = {
	post: Post;
	type: "normal" | "featured";
};

const PostCard: React.FC<PostCardProps> = ({ post, type = "normal" }) => {
	// Calculate estimated read time
	const wordCount = post.content.split(" ").length;
	const readTime = Math.max(1, Math.ceil(wordCount / 200));

	// Get category color
	const getCategoryColor = (category: string) => {
		const colors = {
			technology:
				"bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
			development:
				"bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
			design:
				"bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
			business:
				"bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
			lifestyle:
				"bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
			default:
				"bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
		};
		return (
			colors[category.toLowerCase() as keyof typeof colors] || colors.default
		);
	};

	const baseClasses =
		"group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer";
	const typeClasses =
		type === "featured"
			? "bg-gradient-to-br from-card via-card to-card/80 border-border/50 hover:border-primary/40 shadow-lg hover:shadow-primary/20"
			: "bg-card border-border/30 hover:border-primary/30 shadow-md hover:shadow-lg";

	return (
		<Link to={API_PATHS.POST.GET_ONE_POST(post._id)} className="block">
			<article
				className={`${baseClasses} ${typeClasses} w-full max-w-sm h-[480px] flex flex-col mx-auto`}
			>
				{/* Image Section with Overlay */}
				{post.image && (
					<div className="relative w-full h-48 overflow-hidden">
						<img
							src={post.image}
							alt={post.title}
							className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
						/>
						{/* Gradient overlay */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

						{/* Category badge on image */}
						<div className="absolute top-3 left-3">
							<Badge
								variant="secondary"
								className={`${getCategoryColor(
									post.category
								)} border-0 shadow-lg backdrop-blur-sm`}
							>
								{post.category}
							</Badge>
						</div>

						{/* Read time badge */}
						<div className="absolute top-3 right-3">
							<Badge
								variant="outline"
								className="bg-white/90 dark:bg-black/80 text-xs border-0 shadow-lg backdrop-blur-sm"
							>
								<Clock className="h-3 w-3 mr-1" />
								{readTime} min
							</Badge>
						</div>
					</div>
				)}

				{/* Content Section */}
				<div className="flex flex-col flex-1 p-6 space-y-4">
					{/* Author Info */}
					<div className="flex items-center gap-3">
						<Avatar className="w-8 h-8 ring-2 ring-primary/20 transition-all group-hover:ring-primary/40">
							<AvatarImage src={post.userId.avatar} />
							<AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-primary/20 to-primary/10">
								{post.userId.name.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-foreground truncate">
								{post.userId.name}
							</p>
							<div className="flex items-center gap-1 text-xs text-muted-foreground">
								<Calendar className="h-3 w-3" />
								{dayjs(post.createdAt).format("MMM DD, YYYY")}
							</div>
						</div>
					</div>

					{/* Title and Content */}
					<div className="flex-1 flex flex-col gap-3">
						<h2 className="text-lg font-bold leading-tight text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
							{post.title}
						</h2>
						<p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
							{post.content.replace(/<[^>]*>/g, "").slice(0, 150)}...
						</p>
					</div>

					{/* Stats Row */}
					{(post.views || post.likes || post.comments) && (
						<div className="flex items-center gap-4 text-xs text-muted-foreground">
							{post.views && (
								<div className="flex items-center gap-1">
									<Eye className="h-3 w-3" />
									<span>{post.views.toLocaleString()}</span>
								</div>
							)}
							{post.likes && (
								<div className="flex items-center gap-1">
									<Heart className="h-3 w-3" />
									<span>{post.likes}</span>
								</div>
							)}
							{post.comments && (
								<div className="flex items-center gap-1">
									<MessageCircle className="h-3 w-3" />
									<span>{post.comments}</span>
								</div>
							)}
						</div>
					)}

					{/* Read More Button */}
					<div className="pt-2 border-t border-border/50">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1 text-primary font-medium text-sm group-hover:text-primary/80 transition-colors">
								<span>Read article</span>
								<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
							</div>
							<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-primary/20">
								<ArrowRight className="h-4 w-4 text-primary" />
							</div>
						</div>
					</div>
				</div>

				{/* Hover effect overlay */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
			</article>
		</Link>
	);
};

export default PostCard;
