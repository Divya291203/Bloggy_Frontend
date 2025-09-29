import React, { useEffect } from "react";
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
import { Send, Save, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/utils/data";
import { createPostSchema, type CreatePostFormData } from "@/types/post";
import PostImageUploader from "./PostImageUploader";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import uploadImage from "@/utils/uploadImage";
import type { AIPostIdea } from "@/components/AIPostCreationList";
interface CreatePostProps {
	className?: string;
	idea?: AIPostIdea | null;
}

const CreatePost: React.FC<CreatePostProps> = ({ className, idea }) => {
	const {
		register,
		handleSubmit,
		control,
		watch,
		reset,
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

	// Update form when idea changes
	useEffect(() => {
		if (idea) {
			setValue("title", idea.title);
			setValue("content", idea.description);
			// Handle category safely - use tags[0] or default to empty string
			const category =
				idea.category?.toLowerCase() ||
				(idea.tags && idea.tags[0]?.toLowerCase()) ||
				"";
			setValue("category", category);
		}
	}, [idea, setValue]);

	const onSubmit = async (data: CreatePostFormData, isDraft = false) => {
		let postImageUrl = "";

		if (data.image) {
			const imageUploadResponse = await uploadImage(data.image);
			postImageUrl = imageUploadResponse.url || "";
		}
		try {
			await axiosInstance.post(API_PATHS.POST.CREATE_POST, {
				...data,
				image: postImageUrl,
				isDraft,
			});

			// Reset form after successful submission
			reset();
		} catch (error) {
			console.error("Error creating post:", error);
		}
	};

	const handleSaveDraft = handleSubmit((data) => onSubmit(data, true));
	const handlePublish = handleSubmit((data) => onSubmit(data, false));

	const wordCount = watchedContent
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0).length;
	const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

	return (
		<div className={cn("max-w-4xl md:w-full mx-auto space-y-6", className)}>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Send className="h-5 w-5" />
						Create New Post
					</CardTitle>
				</CardHeader>
				<CardContent>
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
									<Select value={field.value} onValueChange={field.onChange}>
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

						{/* Image Upload */}
						<PostImageUploader
							control={control}
							error={errors.image?.message}
						/>

						{/* Content with auto-growing textarea */}
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
										placeholder="Write your post content here... Share your thoughts, insights, and ideas with your readers."
										{...field}
										className={cn(
											"min-h-[120px] resize-none",
											errors.content &&
												"border-destructive focus-visible:ring-destructive/20"
										)}
										onInput={(e) => {
											const target = e.target as HTMLTextAreaElement;
											target.style.height = "120px";
											target.style.height =
												Math.max(120, target.scrollHeight) + "px";
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

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
							<Button
								type="button"
								onClick={handlePublish}
								disabled={isSubmitting}
								className="flex-1"
								size="lg"
							>
								{isSubmitting ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
										Publishing...
									</>
								) : (
									<>
										<Send className="h-4 w-4 mr-2" />
										Publish Post
									</>
								)}
							</Button>

							<Button
								type="button"
								variant="outline"
								onClick={handleSaveDraft}
								disabled={isSubmitting}
								className="flex-1"
								size="lg"
							>
								<Save className="h-4 w-4 mr-2" />
								Save as Draft
							</Button>
						</div>

						<p className="text-xs text-muted-foreground text-center">
							Drafts are automatically saved and can be published later.
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default CreatePost;
