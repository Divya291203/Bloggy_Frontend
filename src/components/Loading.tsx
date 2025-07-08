import React from "react";
import { cn } from "@/lib/utils";

interface LoadingProps {
	message?: string;
	className?: string;
	size?: "sm" | "md" | "lg";
	fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
	message = "Loading...",
	className,
	size = "md",
	fullScreen = false,
}) => {
	const sizeClasses = {
		sm: "h-16 w-16",
		md: "h-24 w-24",
		lg: "h-32 w-32",
	};

	const containerClasses = fullScreen
		? "min-h-screen bg-background flex items-center justify-center"
		: "flex items-center justify-center p-8";

	return (
		<div className={cn(containerClasses, className)}>
			<div className="text-center">
				<div
					className={cn(
						"animate-spin rounded-full border-b-2 border-primary mx-auto mb-4",
						sizeClasses[size]
					)}
				></div>
				<p className="text-muted-foreground">{message}</p>
			</div>
		</div>
	);
};

export default Loading;
