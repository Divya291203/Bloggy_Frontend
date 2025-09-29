import type { CommentType } from "@/types/typeDef";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
	Heart,
	MessageSquare,
	Reply,
	Calendar,
	MoreVertical,
	Flag,
	Share2,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CreateComment from "./CreateComment";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

dayjs.extend(relativeTime);

interface PostCommentsProps {
	comments: CommentType[];
	onCommentUpdate?: () => void;
}

interface CommentItemProps {
	comment: CommentType;
	isNested?: boolean;
	onCommentUpdate?: () => void;
}

//this is the component that displays the comment
const CommentItem: React.FC<CommentItemProps> = ({
	comment,
	isNested = false,
	onCommentUpdate,
}) => {
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(comment.numberOfLikes || 0);
	const [showReplies, setShowReplies] = useState(false);

	const handleLike = async () => {
		setIsLiked(!isLiked);
		setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
		try {
			await axiosInstance.post(API_PATHS.COMMENT.LIKE_COMMENT, {
				id: comment._id,
			});
		} catch (error) {
			console.error("Error liking comment:", error);
		}
	};

	const handleReply = () => {
		setShowReplyForm(!showReplyForm);
	};

	const handleReplySubmitted = () => {
		setShowReplyForm(false);
		onCommentUpdate?.();
	};

	const timeAgo = dayjs(comment.createdAt).fromNow();
	const hasReplies = comment.replies && comment.replies.length > 0;

	return (
		<div className={`${isNested ? "ml-4 sm:ml-8 mt-4" : ""}`}>
			<Card
				className={`transition-all duration-200 hover:shadow-sm ${isNested
						? "border-l-4 border-l-muted border-t-0 border-r-0 border-b-0 shadow-none bg-muted/20"
						: ""
					}`}
			>
				<CardHeader className="pb-3">
					<div className="flex items-start gap-3">
						<Avatar
							className={`${isNested ? "w-8 h-8" : "w-10 h-10"} flex-shrink-0`}
						>
							<AvatarImage
								src={comment.userId.avatar}
								alt={comment.userId.name}
							/>
							<AvatarFallback className="text-sm font-medium">
								{comment.userId.name.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 min-w-0">
							<div className="flex flex-wrap items-center gap-2 mb-1">
								<span
									className={`font-medium ${isNested ? "text-sm" : "text-base"
										}`}
								>
									{comment.userId.name}
								</span>
								<span
									className={`text-xs px-2 py-0.5 rounded-full font-medium ${comment.userId.role === "admin"
											? "text-red-600 bg-red-50"
											: comment.userId.role === "author"
												? "text-blue-600 bg-blue-50"
												: "text-gray-600 bg-gray-50"
										}`}
								>
									{comment.userId.role.charAt(0).toUpperCase() +
										comment.userId.role.slice(1)}
								</span>
								<span className="text-xs text-muted-foreground flex items-center gap-1">
									<Calendar className="h-3 w-3" />
									{timeAgo}
								</span>
							</div>
							{isNested && (
								<div className="text-xs text-muted-foreground mb-2">
									Replying to a comment
								</div>
							)}
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-8 w-8 p-0 flex-shrink-0"
								>
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>
									<Share2 className="h-4 w-4 mr-2" />
									Share
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Flag className="h-4 w-4 mr-2" />
									Report
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</CardHeader>
				<CardContent className="pt-0">
					<div className={`mb-4 ${isNested ? "text-sm" : ""}`}>
						<p className="leading-relaxed whitespace-pre-wrap">
							{comment.content}
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
						<Button
							variant="ghost"
							size="sm"
							className={`h-8 px-2 sm:px-3 ${isLiked
									? "text-red-500 hover:text-red-600"
									: "text-muted-foreground hover:text-foreground"
								}`}
							onClick={handleLike}
						>
							<Heart
								className={`h-4 w-4 ${isLiked ? "fill-current" : ""} ${likesCount > 0 ? "mr-1" : ""
									}`}
							/>
							{likesCount > 0 && (
								<span className="hidden sm:inline">{likesCount}</span>
							)}
							{likesCount > 0 && (
								<span className="sm:hidden">{likesCount}</span>
							)}
						</Button>

						<Button
							variant="ghost"
							size="sm"
							className="h-8 px-2 sm:px-3 text-muted-forSeground hover:text-foreground"
							onClick={handleReply}
						>
							<Reply className="h-4 w-4 mr-1" />
							<span>Reply</span>
						</Button>

						{hasReplies && (
							<Button
								variant="ghost"
								size="sm"
								className="h-8 px-2 sm:px-3 text-muted-foreground hover:text-foreground"
								onClick={() => setShowReplies(!showReplies)}
							>
								{showReplies ? (
									<ChevronUp className="h-4 w-4 mr-1" />
								) : (
									<ChevronDown className="h-4 w-4 mr-1" />
								)}
								<span className="hidden sm:inline">
									{comment.replies.length}{" "}
									{comment.replies.length === 1 ? "reply" : "replies"}
								</span>
								<span className="sm:hidden">{comment.replies.length}</span>
							</Button>
						)}
					</div>

					{showReplyForm && (
						<div className="mt-4">
							<CreateComment
								postId={comment.postId._id}
								parentCommentId={comment._id}
								onCommentAdded={handleReplySubmitted}
								placeholder={`Reply to ${comment.userId.name}...`}
								compact={true}
								isReply={true}
							/>
						</div>
					)}

					{showReplies && hasReplies && (
						<div className="mt-4 space-y-3">
							{comment.replies.map((reply) => (
								<CommentItem
									key={reply._id}
									comment={reply}
									isNested={true}
									onCommentUpdate={onCommentUpdate}
								/>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

//this is the main component that displays the comments
const PostComments: React.FC<PostCommentsProps> = ({
	comments,
	onCommentUpdate,
}) => {
	const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">(
		"newest"
	);

	// Sort comments by newest, oldest, or popular
	const sortedComments = [...comments].sort((a, b) => {
		switch (sortBy) {
			case "newest":
				return (
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
			case "oldest":
				return (
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
				);
			case "popular":
				return (b.numberOfLikes || 0) - (a.numberOfLikes || 0);
			default:
				return 0;
		}
	});

	// Filter out nested comments (those with parentComment) for the main level
	const topLevelComments = sortedComments.filter(
		(comment) => !comment.parentComment
	);

	if (comments.length === 0) {
		return (
			<Card className="border-2 border-dashed border-muted">
				<CardContent className="pt-6">
					<div className="text-center text-muted-foreground py-8">
						<MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
						<h3 className="text-lg font-medium mb-2">No comments yet</h3>
						<p className="text-sm">Be the first to share your thoughts!</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					<MessageSquare className="h-5 w-5" />
					<h2 className="text-xl font-semibold">
						Comments ({comments.length})
					</h2>
				</div>
				<div className="flex items-center gap-2 self-start sm:self-auto">
					<span className="text-sm text-muted-foreground hidden sm:inline">
						Sort by:
					</span>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="w-full sm:w-auto">
								{sortBy === "newest" && "Newest"}
								{sortBy === "oldest" && "Oldest"}
								{sortBy === "popular" && "Popular"}
								<ChevronDown className="h-4 w-4 ml-1" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setSortBy("newest")}>
								Newest first
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setSortBy("oldest")}>
								Oldest first
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setSortBy("popular")}>
								Most liked
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<Separator />

			<div className="space-y-4 sm:space-y-6">
				{topLevelComments.map((comment, index) => (
					<div key={comment._id}>
						<CommentItem comment={comment} onCommentUpdate={onCommentUpdate} />
						{index < topLevelComments.length - 1 && (
							<Separator className="my-4 sm:my-6" />
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default PostComments;
