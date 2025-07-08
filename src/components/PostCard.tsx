import React from "react";
import { ArrowRight } from "lucide-react";
import type { userType } from "@/types/typeDef";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
}

type PostCardProps = {
	post: Post;
	type: "normal" | "featured";
};

const PostCard: React.FC<PostCardProps> = ({ post, type = "normal" }) => {
	const isFeatured =
		type === "normal"
			? "border-none bg-background"
			: "border-border/50 bg-card dark:bg-gray-900 hover:border-primary transition-colors duration-200 shadow-md";
	return (
		<Link to={API_PATHS.POST.GET_ONE_POST(post._id)}>
			<div
				className={`${isFeatured} shadow-xl rounded-xl overflow-hidden border w-full max-w-sm h-[450px] flex flex-col cursor-pointer mx-auto`}
			>
				{post.image && (
					<div className="w-full h-48 overflow-hidden">
						<img
							src={post.image}
							alt={post.title}
							className="w-full h-full object-cover"
						/>
					</div>
				)}

				{/* Content Section */}
				<div className="flex flex-col flex-1 p-6">
					{/* Category Badge */}
					<div className="flex items-center gap-2 mb-4 justify-between">
						<div className="flex items-center gap-2">
							<Avatar className="w-6 h-6">
								<AvatarImage src={post.userId.avatar} />
								<AvatarFallback>{post.userId.name.charAt(0)}</AvatarFallback>
							</Avatar>
							<span className="text-primary text-sm font-medium">
								{post.userId.name}
							</span>
						</div>
						<span className="text-primary text-sm font-medium">
							{post.category}
						</span>
					</div>

					{/* Title and Content */}
					<div className="flex-1 flex flex-col gap-3">
						<h2
							className={`text-xl font-bold leading-tight transition-colors duration-200 ${
								type === "normal"
									? "text-foreground hover:text-purple-600 dark:hover:text-purple-400"
									: "text-foreground hover:text-purple-600 dark:text-white dark:hover:text-purple-400"
							}`}
						>
							{post.title}
						</h2>
						<p className="text-muted-foreground text-sm leading-relaxed">
							{post.content.slice(0, 120)}...
						</p>
					</div>

					{/* Footer */}
					<div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50 dark:border-gray-700">
						<div className="flex items-center gap-2 justify-center">
							<svg
								className="w-4 h-4 text-muted-foreground"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
									clipRule="evenodd"
								/>
							</svg>
							<span className="text-muted-foreground text-sm">
								{dayjs(post.createdAt).format("MMM DD, YYYY")}
							</span>
						</div>
						<button className="flex items-center gap-1 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors text-sm font-medium">
							Read more
							<ArrowRight className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default PostCard;
