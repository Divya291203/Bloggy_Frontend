import { cn } from "@/lib/utils";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";
import type { CommentType } from "@/types/typeDef";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, MessageSquare, Calendar, Heart, FileText } from "lucide-react";
import dayjs from "dayjs";
import Loading from "@/components/Loading";

interface CommentListProps {
	className?: string;
}

const CommentList: React.FC<CommentListProps> = ({ className }) => {
	const [comments, setComments] = useState<CommentType[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	useEffect(() => {
		const fetchComments = async () => {
			try {
				const response = await axiosInstance.get(
					API_PATHS.COMMENT.GET_ALL_COMMENTS
				);
				setComments(response.data.comment);
				setError(null);
			} catch (error) {
				setError(error as string);
			} finally {
				setLoading(false);
			}
		};
		fetchComments();
	}, []);

	const handleDeleteComment = async (commentId: string) => {
		setDeletingId(commentId);
		try {
			await axiosInstance.delete(API_PATHS.COMMENT.DELETE_COMMENT, {
				data: { id: commentId },
			});
			setComments((prev) => prev.filter((c) => c._id !== commentId));
			setError(null);
		} catch (error) {
			console.error("Error deleting comment:", error);
			setError("Failed to delete comment");
		} finally {
			setDeletingId(null);
		}
	};

	const CommentCard = ({ comment }: { comment: CommentType }) => (
		<Card key={comment._id} className="w-full">
			<CardHeader className="pb-3">
				<div className="flex items-start gap-4">
					<Avatar className="w-12 h-12 flex-shrink-0">
						<AvatarImage
							src={comment.userId.avatar}
							alt={comment.userId.name}
						/>
						<AvatarFallback className="text-sm">
							{comment.userId.name.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-3 mb-2">
							<CardTitle className="text-base">{comment.userId.name}</CardTitle>
							<span
								className={`text-xs font-medium px-2 py-1 rounded-full ${
									comment.userId.role === "admin"
										? "text-red-600 bg-red-100"
										: comment.userId.role === "author"
										? "text-blue-600 bg-blue-100"
										: "text-gray-600 bg-gray-100"
								}`}
							>
								{comment.userId.role.charAt(0).toUpperCase() +
									comment.userId.role.slice(1)}
							</span>
						</div>
						<div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
							<div className="flex items-center gap-1">
								<Calendar className="h-4 w-4" />
								{dayjs(comment.createdAt).format("MMM DD, YYYY")}
							</div>
							<div className="flex items-center gap-1">
								<Heart className="h-4 w-4" />
								{comment.numberOfLikes} likes
							</div>
						</div>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<div className="flex items-center gap-1">
								<FileText className="h-4 w-4" />
								<span className="font-medium">On:</span>
								{comment.postId.title}
							</div>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="mb-4">
					<p className="text-sm leading-relaxed">{comment.content}</p>
				</div>

				{comment.parentComment && (
					<div className="mb-4 p-3 bg-muted rounded-lg">
						<p className="text-xs text-muted-foreground mb-1">
							Reply to comment
						</p>
						<p className="text-sm">This is a reply to another comment</p>
					</div>
				)}

				<div className="flex items-center gap-2 flex-wrap">
					<Button
						variant="outline"
						size="sm"
						className="text-destructive hover:text-destructive"
						onClick={() => handleDeleteComment(comment._id)}
						disabled={deletingId === comment._id}
					>
						{deletingId === comment._id ? (
							<>
								<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1" />
								Deleting...
							</>
						) : (
							<>
								<Trash2 className="h-4 w-4 mr-1" />
								Delete Comment
							</>
						)}
					</Button>
				</div>
			</CardContent>
		</Card>
	);

	if (loading) {
		return (
			<div className={cn("flex flex-1 flex-col gap-6 p-6", className)}>
				<h1 className="text-2xl font-bold">All Comments</h1>
				<Loading message="Loading comments..." />
			</div>
		);
	}

	if (error) {
		return (
			<div className={cn("flex flex-1 flex-col gap-6 p-6", className)}>
				<h1 className="text-2xl font-bold">All Comments</h1>
				<Card>
					<CardContent className="pt-6">
						<div className="text-center text-destructive">
							<p>Error loading comments: {error}</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className={cn("flex flex-1 flex-col gap-6 p-6", className)}>
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">All Comments ({comments.length})</h1>
			</div>

			{comments.length === 0 ? (
				<Card>
					<CardContent className="pt-6">
						<div className="text-center text-muted-foreground">
							<MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
							<p>No comments found</p>
							<p className="text-sm">Comments will appear here once posted</p>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4">
					{comments.map((comment) => (
						<CommentCard key={comment._id} comment={comment} />
					))}
				</div>
			)}
		</div>
	);
};

export default CommentList;
