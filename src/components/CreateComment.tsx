import React, { useState, useContext } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import {
	createCommentSchema,
	type CreateCommentFormData,
} from "@/types/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { UserContext } from "@/context/userContext";
import { Send, MessageSquare, Loader2 } from "lucide-react";

interface CreateCommentProps {
	postId: string;
	onCommentAdded?: () => void;
	parentCommentId?: string;
	placeholder?: string;
	compact?: boolean;
	isReply?: boolean;
}

const CreateComment: React.FC<CreateCommentProps> = ({
	postId,
	onCommentAdded,
	parentCommentId,
	placeholder = "Write a thoughtful comment...",
	compact = false,
	isReply = false,
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const userContext = useContext(UserContext);
	const user = userContext?.user;

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<CreateCommentFormData>({
		resolver: zodResolver(createCommentSchema),
		defaultValues: {
			content: "",
			postId: postId,
		},
		mode: "onChange",
	});

	const content = watch("content");
	const characterCount = content?.length || 0;
	const maxLength = 1000;

	const onSubmit = async (data: CreateCommentFormData) => {
		setIsSubmitting(true);
		setSubmitError(null);
		try {
			if (isReply) {
				const replyData = {
					content: data.content,
					postId: data.postId,
					commentId: parentCommentId,
				};
				await axiosInstance.post(API_PATHS.COMMENT.REPLY_COMMENT, replyData);
			} else {
				const commentData = {
					...data,
					parentComment: parentCommentId || null,
				};
				await axiosInstance.post(API_PATHS.COMMENT.CREATE_COMMENT, commentData);
			}
			onCommentAdded?.();
			reset();
		} catch (error: unknown) {
			console.error("Error creating comment:", error);
			let errorMessage = "Failed to post comment. Please try again.";

			if (error instanceof Error) {
				errorMessage = error.message;
			} else if (error && typeof error === "object" && "response" in error) {
				const axiosError = error as {
					response?: { data?: { message?: string } };
				};
				errorMessage = axiosError.response?.data?.message || errorMessage;
			}

			setSubmitError(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!user) {
		return (
			<Card className="border-2 border-dashed border-muted">
				<CardContent className="pt-6">
					<div className="text-center text-muted-foreground">
						<MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
						<p>Please log in to post a comment</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card
			className={`transition-all duration-200 hover:shadow-md ${
				compact ? "border-0 shadow-none" : ""
			}`}
		>
			<CardHeader className={compact ? "pb-3" : "pb-4"}>
				<div className="flex items-start gap-3">
					<Avatar className="w-10 h-10 flex-shrink-0">
						<AvatarImage src={user.avatar} alt={user.name} />
						<AvatarFallback className="text-sm font-medium">
							{user.name.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-1">
							<span className="font-medium text-sm">{user.name}</span>
							<span
								className={`text-xs px-2 py-0.5 rounded-full font-medium ${
									user.role === "admin"
										? "text-red-600 bg-red-50"
										: user.role === "author"
										? "text-blue-600 bg-blue-50"
										: "text-gray-600 bg-gray-50"
								}`}
							>
								{user.role.charAt(0).toUpperCase() + user.role.slice(1)}
							</span>
						</div>
						<p className="text-xs text-muted-foreground">
							{parentCommentId
								? "Replying to comment"
								: "Add to the discussion"}
						</p>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
					<div className="space-y-2">
						<Textarea
							{...register("content")}
							placeholder={placeholder}
							className={`min-h-[100px] resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 ${
								errors.content
									? "border-destructive focus:border-destructive"
									: ""
							}`}
							maxLength={maxLength}
							disabled={isSubmitting}
						/>
						<div className="flex justify-between items-center text-xs">
							<div>
								{errors.content && (
									<span className="text-destructive">
										{errors.content.message}
									</span>
								)}
							</div>
							<span
								className={`text-muted-foreground ${
									characterCount > maxLength * 0.9 ? "text-orange-500" : ""
								} ${characterCount >= maxLength ? "text-destructive" : ""}`}
							>
								{characterCount}/{maxLength}
							</span>
						</div>
					</div>

					<Input
						{...register("postId")}
						value={postId}
						disabled
						className="hidden"
					/>

					{submitError && (
						<div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
							{submitError}
						</div>
					)}

					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
						<div className="text-xs text-muted-foreground">
							{parentCommentId && (
								<span className="inline-flex items-center gap-1">
									<MessageSquare className="h-3 w-3" />
									Reply
								</span>
							)}
						</div>
						<div className="flex gap-2 justify-end">
							{content && content.trim() && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => reset()}
									disabled={isSubmitting}
								>
									Cancel
								</Button>
							)}
							<Button
								type="submit"
								disabled={
									isSubmitting ||
									characterCount === 0 ||
									characterCount > maxLength
								}
								className="min-w-[100px]"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										<span className="hidden sm:inline">Posting...</span>
										<span className="sm:hidden">...</span>
									</>
								) : (
									<>
										<Send className="h-4 w-4 mr-2" />
										{parentCommentId ? "Reply" : "Comment"}
									</>
								)}
							</Button>
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default CreateComment;
