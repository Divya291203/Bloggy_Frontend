import { z } from "zod";

export const createPostSchema = z.object({
	title: z
		.string()
		.min(1, "Title is required")
		.min(5, "Title must be at least 5 characters long")
		.max(100, "Title must not exceed 100 characters"),
	content: z
		.string()
		.min(1, "Content is required")
		.min(50, "Content must be at least 50 characters long"),
	category: z.string().min(1, "Category is required"),
	image: z
		.instanceof(File)
		.optional()
		.refine(
			(file) => {
				if (!file) return true;
				return file.type.startsWith("image/");
			},
			{ message: "Please select a valid image file" }
		)
		.refine(
			(file) => {
				if (!file) return true;
				return file.size <= 5 * 1024 * 1024; // 5MB limit
			},
			{ message: "Image size must be less than 5MB" }
		),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;

export interface Post {
	_id: string;
	userId: {
		_id: string;
		name: string;
		email: string;
		avatar?: string;
		bio?: string;
		role: string;
	};
	content: string;
	title: string;
	image: string;
	category: string;
	slug: string;
	isDraft: boolean;
	createdAt: string;
	updatedAt: string;
}
