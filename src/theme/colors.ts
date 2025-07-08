export const lightTheme = {
	// Base colors
	background: "oklch(1 0 0)", // White
	foreground: "oklch(0.141 0.005 285.823)", // Dark gray

	// Card colors
	card: "oklch(1 0 0)", // White
	cardForeground: "oklch(0.141 0.005 285.823)", // Dark gray

	// Popover colors
	popover: "oklch(1 0 0)", // White
	popoverForeground: "oklch(0.141 0.005 285.823)", // Dark gray

	// Primary colors (Purple theme)
	primary: "oklch(0.606 0.25 292.717)", // Main purple
	primaryForeground: "oklch(0.969 0.016 293.756)", // Light purple

	// Secondary colors
	secondary: "oklch(0.967 0.001 286.375)", // Light gray
	secondaryForeground: "oklch(0.21 0.006 285.885)", // Dark gray

	// Muted colors
	muted: "oklch(0.967 0.001 286.375)", // Light gray
	mutedForeground: "oklch(0.552 0.016 285.938)", // Medium gray

	// Accent colors
	accent: "oklch(0.967 0.001 286.375)", // Light gray
	accentForeground: "oklch(0.21 0.006 285.885)", // Dark gray

	// Destructive colors
	destructive: "oklch(0.577 0.245 27.325)", // Red

	// Border and input colors
	border: "oklch(0.92 0.004 286.32)", // Light border
	input: "oklch(0.92 0.004 286.32)", // Light input border
	ring: "oklch(0.606 0.25 292.717)", // Purple focus ring

	// Chart colors
	chart1: "oklch(0.646 0.222 41.116)", // Orange
	chart2: "oklch(0.6 0.118 184.704)", // Teal
	chart3: "oklch(0.398 0.07 227.392)", // Blue
	chart4: "oklch(0.828 0.189 84.429)", // Green
	chart5: "oklch(0.769 0.188 70.08)", // Yellow-green

	// Sidebar colors
	sidebar: "oklch(0.985 0 0)", // Nearly white
	sidebarForeground: "oklch(0.141 0.005 285.823)", // Dark gray
	sidebarPrimary: "oklch(0.606 0.25 292.717)", // Purple
	sidebarPrimaryForeground: "oklch(0.969 0.016 293.756)", // Light purple
	sidebarAccent: "oklch(0.967 0.001 286.375)", // Light gray
	sidebarAccentForeground: "oklch(0.21 0.006 285.885)", // Dark gray
	sidebarBorder: "oklch(0.92 0.004 286.32)", // Light border
	sidebarRing: "oklch(0.606 0.25 292.717)", // Purple
};

export const darkTheme = {
	// Base colors
	background: "oklch(0.141 0.005 285.823)", // Dark background
	foreground: "oklch(0.985 0 0)", // Light text

	// Card colors
	card: "oklch(0.21 0.006 285.885)", // Dark card
	cardForeground: "oklch(0.985 0 0)", // Light text

	// Popover colors
	popover: "oklch(0.21 0.006 285.885)", // Dark popover
	popoverForeground: "oklch(0.985 0 0)", // Light text

	// Primary colors (Brighter purple for dark mode)
	primary: "oklch(0.541 0.281 293.009)", // Bright purple
	primaryForeground: "oklch(0.969 0.016 293.756)", // Light purple

	// Secondary colors
	secondary: "oklch(0.274 0.006 286.033)", // Dark secondary
	secondaryForeground: "oklch(0.985 0 0)", // Light text

	// Muted colors
	muted: "oklch(0.274 0.006 286.033)", // Dark muted
	mutedForeground: "oklch(0.705 0.015 286.067)", // Medium light gray

	// Accent colors
	accent: "oklch(0.274 0.006 286.033)", // Dark accent
	accentForeground: "oklch(0.985 0 0)", // Light text

	// Destructive colors
	destructive: "oklch(0.704 0.191 22.216)", // Bright red

	// Border and input colors
	border: "oklch(1 0 0 / 10%)", // Semi-transparent white
	input: "oklch(1 0 0 / 15%)", // Semi-transparent white
	ring: "oklch(0.541 0.281 293.009)", // Bright purple

	// Chart colors (adjusted for dark mode)
	chart1: "oklch(0.488 0.243 264.376)", // Blue-purple
	chart2: "oklch(0.696 0.17 162.48)", // Teal
	chart3: "oklch(0.769 0.188 70.08)", // Yellow-green
	chart4: "oklch(0.627 0.265 303.9)", // Magenta
	chart5: "oklch(0.645 0.246 16.439)", // Orange

	// Sidebar colors
	sidebar: "oklch(0.21 0.006 285.885)", // Dark sidebar
	sidebarForeground: "oklch(0.985 0 0)", // Light text
	sidebarPrimary: "oklch(0.541 0.281 293.009)", // Bright purple
	sidebarPrimaryForeground: "oklch(0.969 0.016 293.756)", // Light purple
	sidebarAccent: "oklch(0.274 0.006 286.033)", // Dark accent
	sidebarAccentForeground: "oklch(0.985 0 0)", // Light text
	sidebarBorder: "oklch(1 0 0 / 10%)", // Semi-transparent white
	sidebarRing: "oklch(0.541 0.281 293.009)", // Bright purple
};

// Color utility functions
export const getThemeColor = (
	colorName: keyof typeof lightTheme,
	isDark = false
) => {
	return isDark ? darkTheme[colorName] : lightTheme[colorName];
};

// Semantic color mappings for different UI states
export const semanticColors = {
	light: {
		success: lightTheme.chart4, // Green
		warning: lightTheme.chart5, // Yellow-green
		error: lightTheme.destructive, // Red
		info: lightTheme.chart3, // Blue
		neutral: lightTheme.muted, // Gray
	},
	dark: {
		success: darkTheme.chart3, // Yellow-green (better visibility in dark)
		warning: darkTheme.chart5, // Orange
		error: darkTheme.destructive, // Bright red
		info: darkTheme.chart1, // Blue-purple
		neutral: darkTheme.muted, // Dark gray
	},
};

// Admin dashboard specific color scheme
export const adminColors = {
	light: {
		stats: {
			posts: lightTheme.chart3, // Blue
			users: lightTheme.primary, // Purple
			views: lightTheme.chart1, // Orange
			comments: lightTheme.chart4, // Green
		},
		status: {
			pending: lightTheme.chart5, // Yellow-green
			approved: lightTheme.chart4, // Green
			rejected: lightTheme.destructive, // Red
			draft: lightTheme.mutedForeground, // Gray
		},
	},
	dark: {
		stats: {
			posts: darkTheme.chart1, // Blue-purple
			users: darkTheme.primary, // Bright purple
			views: darkTheme.chart5, // Orange
			comments: darkTheme.chart2, // Teal
		},
		status: {
			pending: darkTheme.chart5, // Orange
			approved: darkTheme.chart3, // Yellow-green
			rejected: darkTheme.destructive, // Bright red
			draft: darkTheme.mutedForeground, // Medium gray
		},
	},
};

// Export all themes
export const themes = {
	light: lightTheme,
	dark: darkTheme,
	semantic: semanticColors,
	admin: adminColors,
};
