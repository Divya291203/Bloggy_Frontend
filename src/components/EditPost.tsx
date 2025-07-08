import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Save, AlertCircle, Edit3, FileText, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/utils/data";
import { createPostSchema, type CreatePostFormData } from "@/types/post";
import type { Post } from "@/types/post";
import PostImageUploader from "./PostImageUploader";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import uploadImage from "@/utils/uploadImage";
import dayjs from "dayjs";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";

interface EditPostProps {
	className?: string;
	initialPostId?: string;
}

const EditPost: React.FC<EditPostProps> = ({ className, initialPostId }) => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [selectedPost, setSelectedPost] = useState<Post | null>(null);
	const [loading, setLoading] = useState(false);
	const [loadingPosts, setLoadingPosts] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [removeExistingImage, setRemoveExistingImage] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<CreatePostFormData>({
		resolver: zodResolver(createPostSchema),
		defaultValues: {
			title: "",
			content: "",
			category: "",
		},
	});

	// Watch values for real-time updates
	const watchedContent = watch("content", "");

	// Fetch user's posts for selection
	useEffect(() => {
		const fetchPosts = async () => {
			try {
				setLoadingPosts(true);
				const [postsResponse, draftsResponse] = await Promise.all([
					axiosInstance.get(API_PATHS.POST.GET_MY_POSTS),
					axiosInstance.get(API_PATHS.POST.GET_DRAFTS),
				]);

				const allPosts = [
					...postsResponse.data.posts,
					...draftsResponse.data.drafts,
				];
				setPosts(allPosts);

				// If there's an initial post ID, select it
				if (initialPostId) {
					const post = allPosts.find((p) => p._id === initialPostId);
					if (post) {
						setSelectedPost(post);
						loadPostIntoForm(post);
					}
				} else if (allPosts.length > 0) {
					// Default to the latest post
					const latestPost = allPosts.sort(
						(a, b) =>
							new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
					)[0];
					setSelectedPost(latestPost);
					loadPostIntoForm(latestPost);
				}
			} catch (error) {
				console.error("Error fetching posts:", error);
			} finally {
				setLoadingPosts(false);
			}
		};

		fetchPosts();
	}, [initialPostId]);

	const loadPostIntoForm = (post: Post) => {
		setValue("title", post.title);
		setValue("content", post.content);
		setValue("category", post.category);
		setValue("image", undefined); // Clear any file input
		setRemoveExistingImage(false); // Reset image removal state
	};

	const handlePostSelect = (post: Post) => {
		setSelectedPost(post);
		loadPostIntoForm(post);
	};

	const onSubmit = async (data: CreatePostFormData, isDraft = false) => {
		if (!selectedPost) return;

		setLoading(true);
		let postImageUrl = selectedPost.image; // Keep existing image by default

		// Handle image logic
		if (data.image) {
			// New image uploaded - replace the old one
			const imageUploadResponse = await uploadImage(data.image);
			postImageUrl = imageUploadResponse.url || selectedPost.image;
		} else if (removeExistingImage) {
			// User chose to remove the existing image
			postImageUrl = "";
		}
		// If no new image and not removing existing, keep the current image (postImageUrl remains unchanged)

		try {
			await axiosInstance.put(API_PATHS.POST.UPDATE_POST(selectedPost._id), {
				title: data.title,
				content: data.content,
				category: data.category,
				image: postImageUrl,
				isDraft,
			});

			// Update the selected post with new data
			const updatedPost = {
				...selectedPost,
				title: data.title,
				content: data.content,
				category: data.category,
				image: postImageUrl,
				isDraft,
				updatedAt: new Date().toISOString(),
			};

			setSelectedPost(updatedPost);
			setPosts((prev) =>
				prev.map((p) => (p._id === selectedPost._id ? updatedPost : p))
			);

			// Optionally reset the form or keep the updated values

			toast.success(
				`Post ${
					isDraft ? "saved as draft" : "updated and published"
				} successfully!`
			);
		} catch (error) {
			console.error("Error updating post:", error);
			toast.error("Error updating post. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	const handleSaveDraft = handleSubmit((data) => onSubmit(data, true));
	const handleUpdate = handleSubmit((data) =>
		onSubmit(data, selectedPost?.isDraft || false)
	);

	const wordCount = watchedContent
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0).length;
	const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

	// Filter posts based on search term
	const filteredPosts = posts.filter(
		(post) =>
			post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			post.content.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (loadingPosts) {
		return (
			<div className={cn("max-w-6xl mx-auto space-y-6 p-6", className)}>
				<Loading />
			</div>
		);
	}

	return (
		<div className={cn("max-w-7xl mx-auto space-y-6 p-6", className)}>
			<div className="grid gap-8 lg:grid-cols-2">
				{/* Post Selection Sidebar */}
				<div className="lg:col-span-1">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-xl">
								<FileText className="h-6 w-6" />
								Select Post to Edit
							</CardTitle>
						</CardHeader>
						<CardContent>
							{/* Search */}
							<div className="relative mb-6">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search posts..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10 h-11"
								/>
							</div>

							{/* Posts List */}
							<div className="space-y-3 max-h-[500px] overflow-y-auto">
								{filteredPosts.length === 0 ? (
									<div className="text-center text-muted-foreground py-12">
										<FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
										<p className="text-lg font-medium">No posts found</p>
										<p className="text-sm">
											Create your first post to start editing
										</p>
									</div>
								) : (
									filteredPosts.map((post) => (
										<div
											key={post._id}
											onClick={() => handlePostSelect(post)}
											className={cn(
												"p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent hover:shadow-sm",
												selectedPost?._id === post._id &&
													"bg-accent border-primary shadow-sm"
											)}
										>
											<h4 className="font-semibold text-base line-clamp-2 mb-2 leading-relaxed">
												{post.title}
											</h4>
											<p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
												{post.content.length > 120
													? post.content.substring(0, 120) + "..."
													: post.content}
											</p>
											<div className="flex items-center justify-between text-sm text-muted-foreground">
												<span
													className={cn(
														"px-3 py-1 rounded-full font-medium",
														post.isDraft
															? "bg-orange-100 text-orange-700"
															: "bg-green-100 text-green-700"
													)}
												>
													{post.isDraft ? "Draft" : "Published"}
												</span>
												<span className="font-medium">
													{dayjs(post.updatedAt).format("MMM DD, YYYY")}
												</span>
											</div>
										</div>
									))
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Edit Form */}
				<div className="lg:col-span-1">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Edit3 className="h-5 w-5" />
								{selectedPost
									? `Edit: ${selectedPost.title}`
									: "Select a Post to Edit"}
							</CardTitle>
							{selectedPost && (
								<div className="flex items-center gap-4 text-sm text-muted-foreground">
									<span>
										Last updated:{" "}
										{dayjs(selectedPost.updatedAt).format("MMM DD, YYYY HH:mm")}
									</span>
									<span
										className={cn(
											"px-2 py-1 rounded-full text-xs",
											selectedPost.isDraft
												? "bg-orange-100 text-orange-700"
												: "bg-green-100 text-green-700"
										)}
									>
										{selectedPost.isDraft ? "Draft" : "Published"}
									</span>
								</div>
							)}
						</CardHeader>
						<CardContent>
							{!selectedPost ? (
								<div className="text-center text-muted-foreground py-12">
									<Edit3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
									<h3 className="text-lg font-semibold mb-2">
										No Post Selected
									</h3>
									<p>Select a post from the sidebar to start editing</p>
								</div>
							) : (
								<form className="space-y-6">
									{/* Title */}
									<div className="space-y-2">
										<Label htmlFor="title">
											Title <span className="text-destructive">*</span>
										</Label>
										<Input
											id="title"
											type="text"
											placeholder="Enter an engaging title for your post..."
											{...register("title")}
											className={cn(
												"text-lg",
												errors.title &&
													"border-destructive focus-visible:ring-destructive/20"
											)}
										/>
										{errors.title && (
											<div className="flex items-center gap-2 text-sm text-destructive">
												<AlertCircle className="h-4 w-4" />
												{errors.title.message}
											</div>
										)}
									</div>

									{/* Category */}
									<div className="space-y-2">
										<Label htmlFor="category">
											Category <span className="text-destructive">*</span>
										</Label>
										<Controller
											name="category"
											control={control}
											render={({ field }) => (
												<Select
													value={field.value}
													onValueChange={field.onChange}
												>
													<SelectTrigger
														className={cn(
															errors.category &&
																"border-destructive focus-visible:ring-destructive/20"
														)}
													>
														<SelectValue placeholder="Select a category" />
													</SelectTrigger>
													<SelectContent>
														{CATEGORIES.map((category) => (
															<SelectItem
																key={category}
																value={category.toLowerCase()}
															>
																{category}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											)}
										/>
										{errors.category && (
											<div className="flex items-center gap-2 text-sm text-destructive">
												<AlertCircle className="h-4 w-4" />
												{errors.category.message}
											</div>
										)}
									</div>

									{/* Image Upload with existing image support */}
									<PostImageUploader
										control={control}
										error={errors.image?.message}
										existingImage={
											selectedPost?.image && !removeExistingImage
												? selectedPost.image
												: undefined
										}
										onImageRemove={() => setRemoveExistingImage(true)}
									/>

									{/* Content */}
									<div className="space-y-2">
										<Label htmlFor="content">
											Content <span className="text-destructive">*</span>
										</Label>
										<Controller
											name="content"
											control={control}
											render={({ field }) => (
												<Textarea
													id="content"
													placeholder="Write your post content here..."
													{...field}
													className={cn(
														"min-h-[200px] resize-none",
														errors.content &&
															"border-destructive focus-visible:ring-destructive/20"
													)}
													onInput={(e) => {
														const target = e.target as HTMLTextAreaElement;
														target.style.height = "200px";
														target.style.height =
															Math.max(200, target.scrollHeight) + "px";
													}}
												/>
											)}
										/>
										{errors.content && (
											<div className="flex items-center gap-2 text-sm text-destructive">
												<AlertCircle className="h-4 w-4" />
												{errors.content.message}
											</div>
										)}
										<div className="flex justify-between text-xs text-muted-foreground">
											<span>{watchedContent.length} characters</span>
											<span>
												{wordCount} words • {estimatedReadTime} min read
											</span>
										</div>
									</div>

									<Separator />

									{/* Action Buttons */}
									<div className="flex flex-col sm:flex-row gap-4">
										<Button
											type="button"
											onClick={handleUpdate}
											disabled={isSubmitting || loading}
											className="flex-1"
											size="lg"
										>
											{loading ? (
												<>
													<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
													Updating...
												</>
											) : (
												<>
													<Send className="h-4 w-4 mr-2" />
													{selectedPost.isDraft
														? "Update Draft"
														: "Update Post"}
												</>
											)}
										</Button>

										<Button
											type="button"
											variant="outline"
											onClick={handleSaveDraft}
											disabled={isSubmitting || loading}
											className="flex-1"
											size="lg"
										>
											<Save className="h-4 w-4 mr-2" />
											Save as Draft
										</Button>
									</div>

									<p className="text-xs text-muted-foreground text-center">
										Changes will update the existing post. You can switch
										between draft and published status.
									</p>
								</form>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default EditPost;
