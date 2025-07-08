import React, { useState, useRef, useEffect } from "react";
import { Controller, type Control, useWatch } from "react-hook-form";
import type { CreatePostFormData } from "@/types/post";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ImageIcon, Upload, X, Camera, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type PostImageUploaderProps = {
	control: Control<CreatePostFormData>;
	error?: string;
	existingImage?: string; // URL of existing image when editing
	onImageRemove?: () => void; // Callback when existing image is removed
};

const PostImageUploader: React.FC<PostImageUploaderProps> = ({
	control,
	error,
	existingImage,
	onImageRemove,
}) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isDragOver, setIsDragOver] = useState(false);
	const [showExisting, setShowExisting] = useState(!!existingImage);
	const inputRef = useRef<HTMLInputElement>(null);

	// Watch the image field value to detect form reset
	const imageValue = useWatch({ control, name: "image" });

	// Clear preview when form is reset (field value becomes null/undefined)
	useEffect(() => {
		if (!imageValue && previewUrl) {
			URL.revokeObjectURL(previewUrl);
			setPreviewUrl(null);
			if (inputRef.current) {
				inputRef.current.value = "";
			}
		}
	}, [imageValue, previewUrl]);

	const handleImageChange = (
		file: File | null,
		onChange: (value: File | null) => void
	) => {
		if (file) {
			if (previewUrl) URL.revokeObjectURL(previewUrl);
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
			setShowExisting(false); // Hide existing image when new one is uploaded
			onChange(file);
		} else {
			if (previewUrl) URL.revokeObjectURL(previewUrl);
			setPreviewUrl(null);
			onChange(null);
		}
	};

	const handleFileSelect = (
		e: React.ChangeEvent<HTMLInputElement>,
		onChange: (value: File | null) => void
	) => {
		const file = e.target.files?.[0];
		handleImageChange(file || null, onChange);
	};

	const handleDrop = (
		e: React.DragEvent,
		onChange: (value: File | null) => void
	) => {
		e.preventDefault();
		setIsDragOver(false);
		const file = e.dataTransfer.files?.[0];
		if (file && file.type.startsWith("image/")) {
			handleImageChange(file, onChange);
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const handleRemoveImage = (onChange: (value: File | null) => void) => {
		handleImageChange(null, onChange);
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	const handleRemoveExisting = () => {
		setShowExisting(false);
		onImageRemove?.();
		// Don't change the form value here, just hide the existing image
	};

	const handleRestoreExisting = () => {
		setShowExisting(true);
		// Clear any new upload
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			setPreviewUrl(null);
		}
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	// Determine what to show: new upload preview, existing image, or upload area
	const hasNewUpload = !!previewUrl;
	const hasExistingImage = showExisting && !!existingImage;

	return (
		<div className="space-y-2">
			<Label>Featured Image</Label>
			<Controller
				name="image"
				control={control}
				render={({ field: { onChange, ref, ...field } }) => (
					<div className="space-y-3">
						{hasNewUpload ? (
							// New Upload Preview
							<Card className="relative overflow-hidden">
								<div className="relative h-48 w-full">
									<img
										src={previewUrl}
										alt="New upload preview"
										className="h-full w-full object-cover"
									/>
									<div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
										New Upload
									</div>
									<div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
										<button
											type="button"
											onClick={() => inputRef.current?.click()}
											className="flex items-center gap-2 px-3 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors"
										>
											<Camera className="h-4 w-4" />
											Change
										</button>
										<button
											type="button"
											onClick={() => handleRemoveImage(onChange)}
											className="flex items-center gap-2 px-3 py-2 bg-red-500/80 text-white rounded-md hover:bg-red-600/80 transition-colors"
										>
											<X className="h-4 w-4" />
											Remove
										</button>
										{existingImage && (
											<button
												type="button"
												onClick={handleRestoreExisting}
												className="flex items-center gap-2 px-3 py-2 bg-blue-500/80 text-white rounded-md hover:bg-blue-600/80 transition-colors"
											>
												<RotateCcw className="h-4 w-4" />
												Restore Original
											</button>
										)}
									</div>
								</div>
							</Card>
						) : hasExistingImage ? (
							// Existing Image
							<Card className="relative overflow-hidden">
								<div className="relative h-48 w-full">
									<img
										src={existingImage}
										alt="Current image"
										className="h-full w-full object-cover"
									/>
									<div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
										Current Image
									</div>
									<div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
										<button
											type="button"
											onClick={() => inputRef.current?.click()}
											className="flex items-center gap-2 px-3 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors"
										>
											<Camera className="h-4 w-4" />
											Replace
										</button>
										<button
											type="button"
											onClick={() => handleRemoveExisting()}
											className="flex items-center gap-2 px-3 py-2 bg-red-500/80 text-white rounded-md hover:bg-red-600/80 transition-colors"
										>
											<X className="h-4 w-4" />
											Remove
										</button>
									</div>
								</div>
							</Card>
						) : (
							// Upload Area
							<Card
								className={cn(
									"border-2 border-dashed transition-all cursor-pointer hover:border-primary/50",
									isDragOver && "border-primary bg-primary/5",
									error && "border-destructive"
								)}
								onClick={() => inputRef.current?.click()}
								onDrop={(e) => handleDrop(e, onChange)}
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
							>
								<div className="flex flex-col items-center justify-center py-12 px-6 text-center">
									<div className="rounded-full bg-muted p-4 mb-4">
										<ImageIcon className="h-8 w-8 text-muted-foreground" />
									</div>
									<div className="space-y-2">
										<h3 className="font-medium">Choose an image</h3>
										<p className="text-sm text-muted-foreground">
											Drag and drop an image here, or click to browse
										</p>
										<p className="text-xs text-muted-foreground">
											PNG, JPG, GIF up to 5MB
										</p>
									</div>
									<div className="flex items-center gap-2 mt-4 px-4 py-2 bg-primary/10 text-primary rounded-md">
										<Upload className="h-4 w-4" />
										<span className="text-sm font-medium">Upload Image</span>
									</div>
								</div>
							</Card>
						)}

						{/* Status indicators */}
						{existingImage && !showExisting && !hasNewUpload && (
							<div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
								<div className="flex items-center gap-2 text-orange-700">
									<X className="h-4 w-4" />
									<span className="text-sm font-medium">
										Original image will be removed
									</span>
								</div>
								<button
									type="button"
									onClick={handleRestoreExisting}
									className="flex items-center gap-1 px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
								>
									<RotateCcw className="h-3 w-3" />
									Restore
								</button>
							</div>
						)}

						{/* Hidden File Input */}
						<input
							type="file"
							accept="image/*"
							className="hidden"
							ref={(e) => {
								ref(e);
								inputRef.current = e;
							}}
							onChange={(e) => handleFileSelect(e, onChange)}
							name={field.name}
							onBlur={field.onBlur}
							disabled={field.disabled}
						/>
					</div>
				)}
			/>

			{error && <p className="text-sm text-destructive">{error}</p>}

			<p className="text-xs text-muted-foreground">
				{existingImage
					? "You can replace the current image or upload a new one"
					: "Optional: Add a featured image to make your post more engaging"}
			</p>
		</div>
	);
};

export default PostImageUploader;
