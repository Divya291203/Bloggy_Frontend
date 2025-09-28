import z from "zod";

export const createCommentSchema = z.object({
	content: z.string().min(1, "Content is required"),
	postId: z.string().min(1, "Post ID is required"),
});

export type CreateCommentFormData = z.infer<typeof createCommentSchema>;
