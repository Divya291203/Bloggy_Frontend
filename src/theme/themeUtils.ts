import { themes } from "./colors";

/**
 * Generate CSS styles from theme colors
 */
export const generateThemeStyles = (theme: typeof themes.light) => ({
	"--theme-background": theme.background,
	"--theme-foreground": theme.foreground,
	"--theme-primary": theme.primary,
	"--theme-primary-foreground": theme.primaryForeground,
	"--theme-secondary": theme.secondary,
	"--theme-secondary-foreground": theme.secondaryForeground,
	"--theme-muted": theme.muted,
	"--theme-muted-foreground": theme.mutedForeground,
	"--theme-accent": theme.accent,
	"--theme-accent-foreground": theme.accentForeground,
	"--theme-destructive": theme.destructive,
	"--theme-border": theme.border,
	"--theme-input": theme.input,
	"--theme-ring": theme.ring,
	"--theme-chart-1": theme.chart1,
	"--theme-chart-2": theme.chart2,
	"--theme-chart-3": theme.chart3,
	"--theme-chart-4": theme.chart4,
	"--theme-chart-5": theme.chart5,
});

/**
 * Convert OKLCH color to hex for compatibility
 */
export const oklchToHex = (oklch: string): string => {
	// This is a simplified conversion - in production, use a proper color library
	// For now, return the OKLCH as-is since modern browsers support it
	return oklch;
};

/**
 * Theme-aware class generator
 */
export const themeClasses = {
	// Background variants
	bg: {
		primary: "bg-primary",
		secondary: "bg-secondary",
		muted: "bg-muted",
		accent: "bg-accent",
		destructive: "bg-destructive",
		card: "bg-card",
	},

	// Text variants
	text: {
		primary: "text-primary",
		secondary: "text-secondary-foreground",
		muted: "text-muted-foreground",
		accent: "text-accent-foreground",
		destructive: "text-destructive",
		foreground: "text-foreground",
	},

	// Border variants
	border: {
		default: "border-border",
		primary: "border-primary",
		secondary: "border-secondary",
		muted: "border-muted",
		destructive: "border-destructive",
	},

	// Ring variants (focus states)
	ring: {
		default: "ring-ring",
		primary: "ring-primary",
		destructive: "ring-destructive",
	},
};

/**
 * Status color mappings
 */
export const statusColors = {
	success: {
		light: "oklch(0.828 0.189 84.429)", // Green
		dark: "oklch(0.769 0.188 70.08)", // Yellow-green
	},
	warning: {
		light: "oklch(0.769 0.188 70.08)", // Yellow-green
		dark: "oklch(0.645 0.246 16.439)", // Orange
	},
	error: {
		light: "oklch(0.577 0.245 27.325)", // Red
		dark: "oklch(0.704 0.191 22.216)", // Bright red
	},
	info: {
		light: "oklch(0.398 0.07 227.392)", // Blue
		dark: "oklch(0.488 0.243 264.376)", // Blue-purple
	},
};

/**
 * Get status color based on theme mode
 */
export const getStatusColor = (
	status: keyof typeof statusColors,
	isDark = false
) => {
	return isDark ? statusColors[status].dark : statusColors[status].light;
};

/**
 * Admin-specific color utilities
 */
export const adminColorUtils = {
	getStatColor: (
		stat: "posts" | "users" | "views" | "comments",
		isDark = false
	) => {
		const colors = isDark ? themes.admin.dark.stats : themes.admin.light.stats;
		return colors[stat];
	},

	getStatusColor: (
		status: "pending" | "approved" | "rejected" | "draft",
		isDark = false
	) => {
		const colors = isDark
			? themes.admin.dark.status
			: themes.admin.light.status;
		return colors[status];
	},
};

/**
 * Create inline styles for dynamic theming
 */
export const createThemeStyles = (colorValue: string, opacity?: number) => ({
	backgroundColor: opacity
		? `${colorValue}${Math.round(opacity * 255)
				.toString(16)
				.padStart(2, "0")}`
		: colorValue,
	color: "white", // Assuming good contrast with colored backgrounds
});

/**
 * Chart color palette generator
 */
export const getChartColors = (isDark = false) => {
	const theme = isDark ? themes.dark : themes.light;
	return [theme.chart1, theme.chart2, theme.chart3, theme.chart4, theme.chart5];
};

/**
 * Responsive color utilities
 */
export const responsiveColors = {
	card: "bg-card text-card-foreground",
	popover: "bg-popover text-popover-foreground",
	primary: "bg-primary text-primary-foreground",
	secondary: "bg-secondary text-secondary-foreground",
	muted: "bg-muted text-muted-foreground",
	accent: "bg-accent text-accent-foreground",
	destructive: "bg-destructive text-destructive-foreground",
};

export default {
	generateThemeStyles,
	oklchToHex,
	themeClasses,
	statusColors,
	getStatusColor,
	adminColorUtils,
	createThemeStyles,
	getChartColors,
	responsiveColors,
};
