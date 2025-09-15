import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Calendar,
	Tag,
	Clock,
	Share2,
	Check,
	Sparkles,
	Loader2,
} from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import dayjs from "dayjs";
import type { CommentType, userType } from "@/types/typeDef";
import { API_PATHS } from "@/utils/apiPaths";
import PostComments from "./PostComments";
import Loading from "./Loading";
import CreateComment from "./CreateComment";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Post {
	_id: string;
	userId: userType;
	content: string;
	title: string;
	image: string;
	category: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
}

const PostDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [post, setPost] = useState<Post | null>(null);
	const [comments, setComments] = useState<CommentType[]>([]);
	const [loadingComments, setLoadingComments] = useState(true);
	const [errorComments, setErrorComments] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const fetchComments = async () => {
		if (!id) return;

		try {
			setLoadingComments(true);
			setErrorComments(null);
			const commentsResponse = await axiosInstance.get(
				`${API_PATHS.COMMENT.GET_POST_COMMENTS(id)}`
			);
			setComments(commentsResponse.data.comments);
		} catch (err: unknown) {
			console.error("Error fetching comments:", err);
			setErrorComments(
				err instanceof Error ? err.message : "Failed to load comments"
			);
		} finally {
			setLoadingComments(false);
		}
	};

	useEffect(() => {
		const fetchPost = async () => {
			if (!id) {
				setError("No post ID provided");
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				setError(null);

				// Using your existing backend endpoint
				const response = await axiosInstance.get(
					`${API_PATHS.POST.GET_ONE_POST(id)}`
				);
				setPost(response.data.post);

				// Fetch comments separately
				await fetchComments();
			} catch (err: unknown) {
				console.error("Error fetching post:", err);
				setError(err instanceof Error ? err.message : "Failed to load article");
			} finally {
				setLoading(false);
			}
		};

		fetchPost();
	}, [id]);

	// Calculate reading time (rough estimate: 200 words per minute)
	const calculateReadingTime = (content: string) => {
		const wordsPerMinute = 200;
		const wordCount = content.split(/\s+/).length;
		const minutes = Math.ceil(wordCount / wordsPerMinute);
		return minutes;
	};

	// Handle share button click
	const handleShare = async () => {
		try {
			const currentUrl = window.location.href;
			await navigator.clipboard.writeText(currentUrl);
			setCopied(true);

			// Reset copied state after 2 seconds
			setTimeout(() => {
				setCopied(false);
			}, 2000);
		} catch (err) {
			console.error("Failed to copy link:", err);
		}
	};

	const [summary, setSummary] = useState<string | null>(null);
	const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
	const [summaryError, setSummaryError] = useState<string | null>(null);
	const [hasGeneratedSummary, setHasGeneratedSummary] = useState(false);
	// Loading skeleton
	if (loading) {
		return (
			<div className="min-h-screen bg-background text-foreground">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="max-w-4xl mx-auto">
						{/* Back button skeleton */}
						<Skeleton className="h-9 w-32 mb-8" />

						{/* Article skeleton */}
						<Card className="overflow-hidden bg-transparent border-none shadow-none">
							<CardHeader className="space-y-6">
								{/* Category skeleton */}
								<Skeleton className="h-6 w-24" />

								{/* Title skeleton */}
								<div className="space-y-4">
									<Skeleton className="h-12 w-full" />
									<Skeleton className="h-12 w-3/4" />
								</div>

								{/* Meta info skeleton */}
								<div className="flex items-center gap-6">
									<div className="flex items-center gap-3">
										<Skeleton className="w-12 h-12 rounded-full" />
										<div className="space-y-2">
											<Skeleton className="h-4 w-24" />
											<Skeleton className="h-3 w-16" />
										</div>
									</div>
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-4 w-20" />
								</div>
							</CardHeader>

							<CardContent className="space-y-6">
								{/* Image skeleton */}
								<Skeleton className="w-full h-64 md:h-96 rounded-lg" />

								{/* Social buttons skeleton */}
								<div className="flex gap-4">
									{Array.from({ length: 2 }).map((_, index) => (
										<Skeleton key={index} className="h-9 w-20 rounded-md" />
									))}
								</div>

								<Separator />

								{/* Content skeleton */}
								<div className="space-y-4">
									{Array.from({ length: 12 }).map((_, index) => (
										<Skeleton
											key={index}
											className="h-4"
											style={{ width: `${Math.random() * 30 + 70}%` }}
										/>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (error || !post) {
		return (
			<div className="min-h-screen bg-background text-foreground">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="max-w-4xl mx-auto">
						<Card className="text-center bg-transparent border-none shadow-none">
							<CardContent className="pt-6">
								<div className="text-destructive mb-4">
									<svg
										className="w-16 h-16 mx-auto"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
										/>
									</svg>
								</div>
								<h1 className="text-2xl font-bold text-destructive mb-4">
									Article Not Found
								</h1>
								<p className="text-muted-foreground mb-8">
									{error ||
										"The article you're looking for doesn't exist or may have been removed."}
								</p>
								<div className="flex flex-col sm:flex-row gap-4 justify-center">
									<Button variant="secondary" onClick={() => navigate(-1)}>
										Go Back
									</Button>
									<Button asChild>
										<Link to="/post">Browse All Articles</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		);
	}

	const readingTime = calculateReadingTime(post.content);

	const handleGenerateSummary = async () => {
		setIsGeneratingSummary(true);
		setHasGeneratedSummary(false);

		try {
			setSummaryError(null);
			const result = await axiosInstance.post(
				API_PATHS.AI.GENERATE_BLOG_POST_SUMMARY,
				{
					content: post.content,
				}
			);
			setSummary(result.data.summary);
		} catch (err: unknown) {
			console.error("Error generating summary:", err);
			setSummaryError(
				err instanceof Error ? err.message : "Failed to generate summary"
			);
		} finally {
			setHasGeneratedSummary(true);
			setIsGeneratingSummary(false);
		}
	};

	return (
		<div className="min-h-screen bg-background text-foreground">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="max-w-4xl mx-auto">
					{/* Back Button */}
					<Button
						variant="ghost"
						onClick={() => navigate(-1)}
						className="mb-8 pl-0"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to articles
					</Button>

					{/* Article Card */}
					<Card className="overflow-hidden bg-transparent border-none shadow-none">
						<CardHeader className="space-y-6">
							{/* Category Badge */}
							<div className="flex items-center gap-2">
								<Tag className="w-4 h-4 text-primary" />
								<span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
									{post.category}
								</span>
							</div>

							{/* Title */}
							<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
								{post.title}
							</h1>

							{/* Meta Information */}
							<div className="flex flex-wrap items-center gap-6 text-muted-foreground">
								<div className="flex items-center gap-3">
									<Avatar className="w-12 h-12">
										<AvatarImage
											src={post.userId.avatar}
											alt={post.userId.name}
										/>
										<AvatarFallback className="bg-primary text-primary-foreground">
											{post.userId.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="font-semibold text-foreground">
											By {post.userId.name}
										</p>
										<p className="text-sm capitalize">{post.userId.role}</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Clock className="w-4 h-4" />
									<span className="text-sm">{readingTime} min read</span>
								</div>
								<div className="flex items-center gap-2">
									<Calendar className="w-4 h-4" />
									<span className="text-sm">
										{dayjs(post.createdAt).format("MMMM DD, YYYY")}
									</span>
								</div>
							</div>
						</CardHeader>

						<CardContent className="space-y-6">
							{/* Featured Image */}
							{post.image && (
								<div className="w-full overflow-hidden rounded-lg">
									<img
										src={post.image}
										alt={post.title}
										className="w-full h-64 md:h-96 object-cover transition-transform hover:scale-105"
									/>
								</div>
							)}

							{/* Social Share Buttons */}
							<div className="flex items-center gap-3">
								<Button variant="outline" size="sm" onClick={handleShare}>
									<Share2 className="w-4 h-4 mr-2" />
									{copied ? <Check className="w-4 h-4" /> : "Share"}
								</Button>

								{/* Summize Button */}
								<Button
									onClick={handleGenerateSummary}
									className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
								>
									{isGeneratingSummary ? (
										<Loader2 className="h-4 w-4 mr-2" />
									) : (
										<Sparkles className="h-4 w-4 mr-2" />
									)}
									Summize
								</Button>
							</div>

							{hasGeneratedSummary && (
								<Dialog
									open={hasGeneratedSummary}
									onOpenChange={setHasGeneratedSummary}
								>
									<DialogContent>
										{summaryError ? <p>{summaryError}</p> : <p>{summary}</p>}
									</DialogContent>
								</Dialog>
							)}

							<Separator />

							{/* Article Content */}
							<div className="prose prose-lg max-w-none prose-neutral dark:prose-invert">
								<div className="text-foreground leading-relaxed text-lg space-y-6">
									{post.content.split("\n\n").map((paragraph, index) => (
										<p key={index} className="mb-6">
											{paragraph}
										</p>
									))}
								</div>
							</div>

							<Separator />

							{/* Article Footer */}
							<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
								<div className="flex items-center gap-4">
									<Avatar className="w-16 h-16">
										<AvatarImage
											src={post.userId.avatar}
											alt={post.userId.name}
										/>
										<AvatarFallback className="bg-primary text-primary-foreground text-lg">
											{post.userId.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<div>
										<h3 className="font-semibold text-lg text-foreground">
											{post.userId.name}
										</h3>
										<p className="text-muted-foreground capitalize">
											{post.userId.role}
										</p>
										{post.userId.bio && (
											<p className="text-muted-foreground text-sm mt-1 max-w-md">
												{post.userId.bio}
											</p>
										)}
									</div>
								</div>
								<Button asChild>
									<Link to="/post">More Articles</Link>
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Comments Section */}
					<div className="space-y-6">
						<Separator />

						<div>
							<h2 className="text-2xl font-bold mb-6">Join the Discussion</h2>
							<CreateComment
								postId={id as string}
								onCommentAdded={fetchComments}
							/>
						</div>

						{loadingComments && <Loading message="Loading comments..." />}
						{errorComments && (
							<Card className="border-destructive">
								<CardContent className="pt-6">
									<div className="text-center text-destructive">
										<p>{errorComments}</p>
										<Button
											variant="outline"
											size="sm"
											className="mt-4"
											onClick={fetchComments}
										>
											Try Again
										</Button>
									</div>
								</CardContent>
							</Card>
						)}

						{!loadingComments && !errorComments && (
							<PostComments
								comments={comments}
								onCommentUpdate={fetchComments}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostDetails;
