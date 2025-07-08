import { z } from "zod";

export const profileSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.min(2, "Name must be at least 2 characters long")
		.max(50, "Name must not exceed 50 characters"),
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
	bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
	avatar: z
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

export type ProfileFormData = z.infer<typeof profileSchema>;
