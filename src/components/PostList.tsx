import { cn } from "@/lib/utils";
import type { Post } from "@/types/post";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { Calendar, Edit, Send, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import Loading from "@/components/Loading";

interface PostListProps {
	className?: string;
	onEditPost?: (postId: string) => void;
}

const PostList: React.FC<PostListProps> = ({ className, onEditPost }) => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [togglingId, setTogglingId] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await axiosInstance.get(API_PATHS.POST.GET_ALL_POSTS);
				setPosts(response.data.posts);
				setError(null);
			} catch (error) {
				setError(error as string);
			} finally {
				setLoading(false);
			}
		};
		fetchPosts();
	}, []);

	const handleTogglePublish = async (post: Post) => {
		setTogglingId(post._id);
		try {
			// Toggle the isDraft status
			await axiosInstance.put(API_PATHS.POST.UPDATE_POST(post._id), {
				isDraft: !post.isDraft,
			});

			// Update the post in the local state
			setPosts((prev) =>
				prev.map((p) =>
					p._id === post._id ? { ...p, isDraft: !p.isDraft } : p
				)
			);
			setError(null);
		} catch (error) {
			console.error("Error toggling post status:", error);
			setError("Failed to update post status");
		} finally {
			setTogglingId(null);
		}
	};

	const handleDeletePost = async (postId: string) => {
		setDeletingId(postId);
		try {
			await axiosInstance.delete(API_PATHS.POST.DELETE_POST, {
				data: { id: postId },
			});
			setPosts((prev) => prev.filter((p) => p._id !== postId));
			setError(null);
		} catch (error) {
			console.error("Error deleting post:", error);
			setError("Failed to delete post");
		} finally {
			setDeletingId(null);
		}
	};

	const PostCard = ({ post }: { post: Post }) => (
		<Card key={post._id} className="w-full">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1 min-w-0">
						<CardTitle className="text-lg line-clamp-2 mb-2">
							{post.title}
						</CardTitle>
						<div className="flex items-center gap-3 text-sm text-muted-foreground">
							<div className="flex items-center gap-1">
								<Calendar className="h-4 w-4" />
								{dayjs(post.createdAt).format("MMM DD, YYYY")}
							</div>
							<span className="text-primary text-xs font-medium px-2 py-1 bg-primary/10 rounded-full">
								{post.category}
							</span>
							<span
								className={`text-xs font-medium px-2 py-1 rounded-full ${
									post.isDraft
										? "text-orange-600 bg-orange-100"
										: "text-green-600 bg-green-100"
								}`}
							>
								{post.isDraft ? "Draft" : "Published"}
							</span>
						</div>
						<div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
							<span>By {post.userId.name}</span>
						</div>
					</div>
					{post.image && (
						<img
							src={post.image}
							alt={post.title}
							className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
						/>
					)}
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<p className="text-sm text-muted-foreground line-clamp-2 mb-4">
					{post.content.replace(/<[^>]*>/g, "").substring(0, 150)}...
				</p>
				<div className="flex items-center gap-2 flex-wrap">
					{onEditPost && (
						<Button
							variant="secondary"
							size="sm"
							onClick={() => onEditPost(post._id)}
						>
							<Edit className="h-4 w-4 mr-1" />
							Edit
						</Button>
					)}
					<Button
						size="sm"
						variant={post.isDraft ? "default" : "outline"}
						onClick={() => handleTogglePublish(post)}
						disabled={togglingId === post._id}
					>
						{togglingId === post._id ? (
							<>
								<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1" />
								{post.isDraft ? "Publishing..." : "Unpublishing..."}
							</>
						) : (
							<>
								{post.isDraft ? (
									<>
										<Send className="h-4 w-4 mr-1" />
										Publish
									</>
								) : (
									<>
										<Edit className="h-4 w-4 mr-1" />
										Unpublish
									</>
								)}
							</>
						)}
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="text-destructive hover:text-destructive"
						onClick={() => handleDeletePost(post._id)}
						disabled={deletingId === post._id}
					>
						{deletingId === post._id ? (
							<>
								<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1" />
								Deleting...
							</>
						) : (
							<>
								<Trash2 className="h-4 w-4 mr-1" />
								Delete
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
				<h1 className="text-2xl font-bold">All Posts</h1>
				<Loading message="Loading all posts..." />
			</div>
		);
	}

	if (error) {
		return (
			<div className={cn("flex flex-1 flex-col gap-6 p-6", className)}>
				<h1 className="text-2xl font-bold">All Posts</h1>
				<Card>
					<CardContent className="pt-6">
						<div className="text-center text-destructive">
							<p>Error loading posts: {error}</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className={cn("flex flex-1 flex-col gap-6 p-6", className)}>
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">All Posts ({posts.length})</h1>
			</div>

			{posts.length === 0 ? (
				<Card>
					<CardContent className="pt-6">
						<div className="text-center text-muted-foreground">
							<Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
							<p>No posts found</p>
							<p className="text-sm">Posts will appear here once created</p>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4">
					{posts.map((post) => (
						<PostCard key={post._id} post={post} />
					))}
				</div>
			)}
		</div>
	);
};

export default PostList;
