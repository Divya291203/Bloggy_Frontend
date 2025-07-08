import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/themeContext";

interface ThemeToggleProps {
	className?: string;
	size?: "sm" | "md" | "lg";
	variant?: "button" | "icon" | "switch";
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
	className = "",
	size = "md",
	variant = "button",
}) => {
	const { mode, toggleTheme } = useTheme();

	const sizeClasses = {
		sm: "h-8 w-8 text-sm",
		md: "h-10 w-10 text-base",
		lg: "h-12 w-12 text-lg",
	};

	const iconSizes = {
		sm: "h-4 w-4",
		md: "h-5 w-5",
		lg: "h-6 w-6",
	};

	if (variant === "icon") {
		return (
			<button
				onClick={toggleTheme}
				className={`
          ${sizeClasses[size]}
          rounded-md border border-border bg-background
          flex items-center justify-center
          hover:bg-accent hover:text-accent-foreground
          transition-colors duration-200 cursor-pointer
          ${className}
        `}
				aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
			>
				{mode === "light" ? (
					<Moon className={iconSizes[size]} />
				) : (
					<Sun className={iconSizes[size]} />
				)}
			</button>
		);
	}

	if (variant === "switch") {
		return (
			<div className={`flex items-center gap-2 ${className}`}>
				<Sun
					className={`${iconSizes[size]} ${
						mode === "dark" ? "text-muted-foreground" : "text-foreground"
					}`}
				/>
				<button
					onClick={toggleTheme}
					className={`
            relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer
            ${mode === "dark" ? "bg-primary" : "bg-muted"}
          `}
					role="switch"
					aria-checked={mode === "dark"}
					aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
				>
					<span
						className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 
              transition duration-200 ease-in-out
              ${mode === "dark" ? "translate-x-5" : "translate-x-0"}
            `}
					/>
				</button>
				<Moon
					className={`${iconSizes[size]} ${
						mode === "light" ? "text-muted-foreground" : "text-foreground"
					}`}
				/>
			</div>
		);
	}

	// Default button variant
	return (
		<button
			onClick={toggleTheme}
			className={`
        inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2
        hover:bg-accent hover:text-accent-foreground
        transition-colors duration-200
        text-sm font-medium cursor-pointer
        ${className}
      `}
			aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
		>
			{mode === "light" ? (
				<>
					<Moon className={iconSizes[size]} />
					Dark Mode
				</>
			) : (
				<>
					<Sun className={iconSizes[size]} />
					Light Mode
				</>
			)}
		</button>
	);
};
