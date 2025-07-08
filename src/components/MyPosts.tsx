import { cn } from "@/lib/utils";
import type { Post } from "@/types/post";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Send, Edit, Trash2, Calendar } from "lucide-react";
import dayjs from "dayjs";
import Loading from "@/components/Loading";

interface MyPostsProps {
	className?: string;
	onEditPost?: (postId: string) => void;
}

const MyPosts: React.FC<MyPostsProps> = ({ className, onEditPost }) => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [drafts, setDrafts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [publishingId, setPublishingId] = useState<string | null>(null);
	const [unpublishingId, setUnpublishingId] = useState<string | null>(null);

	useEffect(() => {
		const fetchPostsAndDrafts = async () => {
			try {
				const responsePosts = await axiosInstance.get(
					API_PATHS.POST.GET_MY_POSTS
				);
				const responseDrafts = await axiosInstance.get(
					API_PATHS.POST.GET_DRAFTS
				);

				setPosts(responsePosts.data.posts);
				setDrafts(responseDrafts.data.drafts);
				setError(null);
			} catch (error) {
				setError(error as string);
			} finally {
				setLoading(false);
			}
		};
		fetchPostsAndDrafts();
	}, []);

	const handlePublishDraft = async (draft: Post) => {
		setPublishingId(draft._id);
		try {
			// Update the draft to make it published
			await axiosInstance.put(API_PATHS.POST.UPDATE_POST(draft._id), {
				isDraft: false,
			});

			// Move the draft to posts and remove from drafts
			const updatedDraft = { ...draft, isDraft: false };
			setPosts((prev) => [updatedDraft, ...prev]);
			setDrafts((prev) => prev.filter((d) => d._id !== draft._id));
		} catch (error) {
			console.error("Error publishing draft:", error);
			setError("Failed to publish draft");
		} finally {
			setPublishingId(null);
		}
	};

	const handleDeletePost = async (postId: string) => {
		try {
			await axiosInstance.delete(API_PATHS.POST.DELETE_POST, {
				data: { id: postId },
			});
			setPosts((prev) => prev.filter((p) => p._id !== postId));
			setDrafts((prev) => prev.filter((d) => d._id !== postId));
			setError(null);
		} catch (error) {
			console.error("Error deleting post:", error);
			setError("Failed to delete post");
		} finally {
			setLoading(false);
		}
	};

	const handleUnpublishPost = async (post: Post) => {
		setUnpublishingId(post._id);
		try {
			// Update the post to make it a draft
			await axiosInstance.put(API_PATHS.POST.UPDATE_POST(post._id), {
				isDraft: true,
			});

			// Move the post to drafts and remove from published posts
			const updatedPost = { ...post, isDraft: true };
			setDrafts((prev) => [updatedPost, ...prev]);
			setPosts((prev) => prev.filter((p) => p._id !== post._id));
		} catch (error) {
			console.error("Error unpublishing post:", error);
			setError("Failed to unpublish post");
		} finally {
			setUnpublishingId(null);
		}
	};

	const PostCard = ({
		post,
		isDraft = false,
	}: {
		post: Post;
		isDraft?: boolean;
	}) => (
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
							{isDraft && (
								<span className="text-orange-600 text-xs font-medium px-2 py-1 bg-orange-100 rounded-full">
									Draft
								</span>
							)}
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
					{isDraft && (
						<Button
							size="sm"
							onClick={() => handlePublishDraft(post)}
							disabled={publishingId === post._id}
						>
							{publishingId === post._id ? (
								<>
									<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1" />
									Publishing...
								</>
							) : (
								<>
									<Send className="h-4 w-4 mr-1" />
									Publish
								</>
							)}
						</Button>
					)}
					{!isDraft && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleUnpublishPost(post)}
							disabled={unpublishingId === post._id}
						>
							{unpublishingId === post._id ? (
								<>
									<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-1" />
									Unpublishing...
								</>
							) : (
								<>
									<Edit className="h-4 w-4 mr-1" />
									Unpublish
								</>
							)}
						</Button>
					)}
					<Button
						variant="outline"
						size="sm"
						className="text-destructive hover:text-destructive"
						onClick={() => handleDeletePost(post._id)}
					>
						<Trash2 className="h-4 w-4 mr-1" />
						Delete
					</Button>
				</div>
			</CardContent>
		</Card>
	);

	if (loading) {
		return (
			<div className={cn("flex flex-1 flex-col gap-6 p-6", className)}>
				<Loading message="Loading your posts..." />
			</div>
		);
	}

	if (error) {
		return (
			<div className={cn("flex flex-1 flex-col gap-6 p-6", className)}>
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
			{/* Drafts Section */}
			<div>
				<h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
					<Edit className="h-6 w-6" />
					Drafts ({drafts.length})
				</h2>
				{drafts.length === 0 ? (
					<Card>
						<CardContent className="pt-6">
							<div className="text-center text-muted-foreground">
								<Edit className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p>No drafts found</p>
								<p className="text-sm">Your draft posts will appear here</p>
							</div>
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-4">
						{drafts.map((draft) => (
							<PostCard key={draft._id} post={draft} isDraft />
						))}
					</div>
				)}
			</div>

			<Separator />

			{/* Published Posts Section */}
			<div>
				<h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
					<Send className="h-6 w-6" />
					Published Posts ({posts.length})
				</h2>
				{posts.length === 0 ? (
					<Card>
						<CardContent className="pt-6">
							<div className="text-center text-muted-foreground">
								<Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p>No published posts found</p>
								<p className="text-sm">Your published posts will appear here</p>
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
		</div>
	);
};

export default MyPosts;
