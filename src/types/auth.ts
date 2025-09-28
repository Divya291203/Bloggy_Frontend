import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().min(1, "Email is required").email("Invalid email format"),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().min(1, "Email is required").email("Invalid email format"),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters"),
	role: z.enum(["admin", "reader", "author"], {
		message: "Role is required",
	}),
	profileImage: z.instanceof(File).optional(),
});

export type SignupFormData = z.infer<typeof signupSchema>;
