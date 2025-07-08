import { useUser } from "@/context/userContext";
import { cn } from "@/lib/utils";
import React, { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	User,
	Mail,
	Edit,
	Save,
	AlertCircle,
	Upload,
	Trash2,
	Camera,
} from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import uploadImage from "@/utils/uploadImage";
import { profileSchema, type ProfileFormData } from "@/types/profile";

interface ProfileProps {
	className?: string;
}

const Profile: React.FC<ProfileProps> = ({ className }) => {
	const { user, updateUser } = useUser();
	const [isLoading, setIsLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isDirty },
		watch,
		reset,
	} = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: user?.name || "",
			email: user?.email || "",
			bio: user?.bio || "",
			avatar: undefined,
		},
	});

	const handleImageChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		onChange: (value: File | null) => void
	) => {
		const file = e.target.files?.[0];
		if (file) {
			if (previewUrl) URL.revokeObjectURL(previewUrl);
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
			onChange(file);
		} else {
			onChange(null);
		}
	};

	const handleImageDelete = (onChange: (value: File | null) => void) => {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setPreviewUrl(null);
		onChange(null);
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	const onSubmit = async (data: ProfileFormData) => {
		setIsLoading(true);
		setError(null);
		setSuccess(false);

		try {
			let avatarUrl = user?.avatar || "";

			// Upload new avatar if provided
			if (data.avatar) {
				const imageUploadResponse = await uploadImage(data.avatar);
				avatarUrl = imageUploadResponse.url || "";
			}

			await axiosInstance.put(API_PATHS.USER.UPDATE_USER, {
				id: user?._id,
				name: data.name,
				email: data.email,
				bio: data.bio,
				avatar: avatarUrl,
			});

			// Update user context with new data
			if (updateUser) {
				updateUser({
					...user!,
					name: data.name,
					email: data.email,
					bio: data.bio || "",
					avatar: avatarUrl,
				});
			}

			setSuccess(true);
			// Reset form dirty state
			reset({
				name: data.name,
				email: data.email,
				bio: data.bio,
				avatar: undefined,
			});

			// Clear preview
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
				setPreviewUrl(null);
			}

			// Clear success message after 3 seconds
			setTimeout(() => setSuccess(false), 3000);
		} catch (error: unknown) {
			console.error("Error updating profile:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to update profile. Please try again.";
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	if (!user) {
		return (
			<div className={cn("flex flex-1 flex-col gap-6 p-6", className)}>
				<Card>
					<CardContent className="pt-6">
						<div className="text-center text-muted-foreground">
							<User className="h-12 w-12 mx-auto mb-4 opacity-50" />
							<p>Please log in to view your profile</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className={cn("flex flex-1 flex-col gap-6 p-6", className)}>
			<div className="flex items-center gap-2">
				<User className="h-6 w-6" />
				<h1 className="text-2xl font-bold">Profile Settings</h1>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Edit className="h-5 w-5" />
						Update Your Profile
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Avatar Upload Section */}
						<div className="space-y-2">
							<Label>Profile Picture</Label>
							<Controller
								name="avatar"
								control={control}
								render={({ field: { onChange, ref, ...field } }) => (
									<div className="flex items-center gap-6">
										<div className="relative">
											<Avatar
												className="w-20 h-20 cursor-pointer"
												onClick={() => inputRef.current?.click()}
											>
												<AvatarImage
													src={previewUrl || user.avatar}
													alt={user.name}
												/>
												<AvatarFallback className="text-lg">
													{user.name.charAt(0).toUpperCase()}
												</AvatarFallback>
											</Avatar>

											{previewUrl ? (
												<button
													type="button"
													onClick={() => handleImageDelete(onChange)}
													className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
												>
													<Trash2 className="h-3 w-3" />
												</button>
											) : (
												<button
													type="button"
													onClick={() => inputRef.current?.click()}
													className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors"
												>
													<Camera className="h-3 w-3" />
												</button>
											)}
										</div>

										<div className="flex-1">
											<div className="flex flex-col gap-2">
												<Button
													type="button"
													variant="outline"
													onClick={() => inputRef.current?.click()}
													className="w-fit"
												>
													<Upload className="h-4 w-4 mr-2" />
													{previewUrl ? "Change Image" : "Upload Image"}
												</Button>
												<p className="text-xs text-muted-foreground">
													PNG, JPG, GIF up to 5MB
												</p>
											</div>
										</div>

										<input
											type="file"
											accept="image/*"
											className="hidden"
											ref={(e) => {
												ref(e);
												inputRef.current = e;
											}}
											onChange={(e) => handleImageChange(e, onChange)}
											name={field.name}
											onBlur={field.onBlur}
											disabled={field.disabled}
										/>
									</div>
								)}
							/>
							{errors.avatar && (
								<div className="flex items-center gap-2 text-sm text-destructive">
									<AlertCircle className="h-4 w-4" />
									{errors.avatar.message}
								</div>
							)}
						</div>

						{/* Name Field */}
						<div className="space-y-2">
							<Label htmlFor="name">
								Full Name <span className="text-destructive">*</span>
							</Label>
							<Input
								id="name"
								type="text"
								placeholder="Enter your full name"
								{...register("name")}
								className={cn(
									errors.name &&
										"border-destructive focus-visible:ring-destructive/20"
								)}
							/>
							{errors.name && (
								<div className="flex items-center gap-2 text-sm text-destructive">
									<AlertCircle className="h-4 w-4" />
									{errors.name.message}
								</div>
							)}
						</div>

						{/* Email Field */}
						<div className="space-y-2">
							<Label htmlFor="email">
								Email Address <span className="text-destructive">*</span>
							</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									id="email"
									type="email"
									placeholder="Enter your email address"
									className={cn(
										"pl-10",
										errors.email &&
											"border-destructive focus-visible:ring-destructive/20"
									)}
									{...register("email")}
								/>
							</div>
							{errors.email && (
								<div className="flex items-center gap-2 text-sm text-destructive">
									<AlertCircle className="h-4 w-4" />
									{errors.email.message}
								</div>
							)}
						</div>

						{/* Bio Field */}
						<div className="space-y-2">
							<Label htmlFor="bio">Bio</Label>
							<Textarea
								id="bio"
								placeholder="Tell us a little about yourself..."
								className={cn(
									"min-h-[100px] resize-none",
									errors.bio &&
										"border-destructive focus-visible:ring-destructive/20"
								)}
								{...register("bio")}
							/>
							{errors.bio && (
								<div className="flex items-center gap-2 text-sm text-destructive">
									<AlertCircle className="h-4 w-4" />
									{errors.bio.message}
								</div>
							)}
							<div className="text-xs text-muted-foreground">
								{watch("bio")?.length || 0}/500 characters
							</div>
						</div>

						{/* User Role (Read-only) */}
						<div className="space-y-2">
							<Label>Account Role</Label>
							<div className="flex items-center gap-2">
								<span
									className={`text-sm font-medium px-3 py-2 rounded-full ${
										user.role === "admin"
											? "text-red-600 bg-red-100"
											: user.role === "author"
											? "text-blue-600 bg-blue-100"
											: "text-gray-600 bg-gray-100"
									}`}
								>
									{user.role.charAt(0).toUpperCase() + user.role.slice(1)}
								</span>
								<p className="text-sm text-muted-foreground">
									Contact admin to change your role
								</p>
							</div>
						</div>

						{/* Success/Error Messages */}
						{success && (
							<div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
								<AlertCircle className="h-4 w-4" />
								Profile updated successfully!
							</div>
						)}

						{error && (
							<div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
								<AlertCircle className="h-4 w-4" />
								{error}
							</div>
						)}

						{/* Submit Button */}
						<div className="flex gap-3 pt-4 border-t">
							<Button
								type="submit"
								disabled={isLoading || !isDirty}
								className="flex-1"
								size="lg"
							>
								{isLoading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
										Updating...
									</>
								) : (
									<>
										<Save className="h-4 w-4 mr-2" />
										Update Profile
									</>
								)}
							</Button>
						</div>

						<p className="text-xs text-muted-foreground text-center">
							Your information is secure and will only be used to personalize
							your experience.
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default Profile;
