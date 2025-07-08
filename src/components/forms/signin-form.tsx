import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { useForm, Controller, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "@/types/auth";
import { Link, useNavigate } from "react-router-dom";
import ProfileImageUploader from "../ProfileImageUploader";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { UserContext } from "@/context/userContext";
import { useContext } from "react";
import uploadImage from "@/utils/uploadImage";

export function SignInForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
	});

	const navigate = useNavigate();
	const context = useContext(UserContext);

	if (!context) {
		throw new Error("UserContext not found");
	}

	const { updateUser } = context;

	const onSubmit = async (data: SignupFormData) => {
		let profileImageUrl = "";

		//upload image if it exists
		if (data.profileImage) {
			const imageUploadResponse = await uploadImage(data.profileImage);
			profileImageUrl = imageUploadResponse.url || "";
		}

		try {
			const response = await axiosInstance.post(API_PATHS.AUTH.SIGNUP, {
				name: data.name,
				email: data.email,
				password: data.password,
				role: data.role,
				avatar: profileImageUrl,
			});

			const { token } = response.data;

			if (token) {
				localStorage.setItem("token", token);
				updateUser(response.data);
				navigate("/");
			}
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	const onError = (errors: FieldErrors<SignupFormData>) => {
		console.log("Form validation errors:", errors);
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Create an account</CardTitle>
					<CardDescription>
						Enter your details below to create your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit, onError)}>
						<div className="flex flex-col gap-6">
							<ProfileImageUploader control={control} />
							<div className="grid gap-3">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									type="text"
									placeholder="John Doe"
									{...register("name")}
								/>
								{errors.name && (
									<p className="text-red-500 text-sm mt-1">
										{errors.name.message}
									</p>
								)}
							</div>
							<div className="grid gap-3">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									{...register("email")}
								/>
								{errors.email && (
									<p className="text-red-500 text-sm mt-1">
										{errors.email.message}
									</p>
								)}
							</div>
							<div className="flex gap-3">
								<div className="w-[60%] grid gap-3">
									<div className="flex items-center">
										<Label htmlFor="password">Password</Label>
									</div>
									<Input
										id="password"
										type="password"
										{...register("password")}
									/>
									{errors.password && (
										<p className="text-red-500 text-sm mt-1">
											{errors.password.message}
										</p>
									)}
								</div>
								<div className="grid gap-3">
									<Label htmlFor="role">Role</Label>
									<Controller
										name="role"
										control={control}
										render={({ field }) => (
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<SelectTrigger id="role">
													<SelectValue placeholder="Select a role" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="admin">Admin</SelectItem>
													<SelectItem value="reader">Reader</SelectItem>
													<SelectItem value="author">Author</SelectItem>
												</SelectContent>
											</Select>
										)}
									/>
									{errors.role && (
										<p className="text-red-500 text-sm mt-1">
											{errors.role.message}
										</p>
									)}
								</div>
							</div>
							<div className="flex flex-col gap-3">
								<Button type="submit" className="w-full">
									Sign up
								</Button>
							</div>
						</div>
						<div className="mt-4 text-center text-sm">
							Already have an account?{" "}
							<Link to="/login" className="underline underline-offset-4">
								Login
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
