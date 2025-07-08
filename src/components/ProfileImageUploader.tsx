import React, { useState, useRef } from "react";
import { Controller, type Control } from "react-hook-form";
import type { SignupFormData } from "@/types/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import PROFILE_IMAGE_DEFAULT from "@/assets/prevprofile.jpg";
import { LuUpload, LuTrash } from "react-icons/lu";

type ProfileImageUploaderProps = {
	control: Control<SignupFormData>;
};

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
	control,
}) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

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
		setPreviewUrl(null);
		onChange(null);
	};

	return (
		<Controller
			name="profileImage"
			control={control}
			defaultValue={undefined}
			render={({ field: { onChange, ref, ...field } }) => (
				<div className="flex flex-col items-center gap-4 relative">
					<Avatar
						className="h-24 w-24 cursor-pointer overflow-hidden"
						onClick={() => inputRef.current?.click()}
					>
						<AvatarImage
							src={previewUrl || PROFILE_IMAGE_DEFAULT}
							className="rounded-full w-full h-full object-cover"
						/>
						<AvatarFallback>👤</AvatarFallback>
					</Avatar>

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

					{previewUrl ? (
						<div
							onClick={() => handleImageDelete(onChange)}
							className="absolute -bottom-2 translate-x-7 w-8 h-8 rounded-full bg-red-700 flex items-center justify-center text-white cursor-pointer hover:bg-red-600"
						>
							<LuTrash size={16} />
						</div>
					) : (
						<div
							onClick={() => inputRef.current?.click()}
							className="absolute -bottom-2 translate-x-7 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white cursor-pointer hover:bg-primary/90"
						>
							<LuUpload size={16} />
						</div>
					)}
				</div>
			)}
		/>
	);
};

export default ProfileImageUploader;
