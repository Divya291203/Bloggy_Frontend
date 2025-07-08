import React, { createContext, useContext, useEffect, useState } from "react";
import { themes } from "@/theme/colors";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
	mode: ThemeMode;
	toggleTheme: () => void;
	setTheme: (mode: ThemeMode) => void;
	theme: typeof themes.light;
	semanticColors: typeof themes.semantic.light;
	adminColors: typeof themes.admin.light;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [mode, setMode] = useState<ThemeMode>(() => {
		// Check if user has a saved preference
		const savedTheme = localStorage.getItem("theme") as ThemeMode;
		if (savedTheme) return savedTheme;

		// Check system preference
		if (
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches
		) {
			return "dark";
		}
		return "light";
	});

	useEffect(() => {
		// Update document class and save preference
		const root = document.documentElement;
		if (mode === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
		localStorage.setItem("theme", mode);
	}, [mode]);

	// Listen for system theme changes
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = (e: MediaQueryListEvent) => {
			// Only auto-switch if user hasn't manually set a preference
			const savedTheme = localStorage.getItem("theme");
			if (!savedTheme) {
				setMode(e.matches ? "dark" : "light");
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	const toggleTheme = () => {
		setMode((prev) => (prev === "light" ? "dark" : "light"));
	};

	const setTheme = (newMode: ThemeMode) => {
		setMode(newMode);
	};

	const value: ThemeContextType = {
		mode,
		toggleTheme,
		setTheme,
		theme: mode === "dark" ? themes.dark : themes.light,
		semanticColors:
			mode === "dark" ? themes.semantic.dark : themes.semantic.light,
		adminColors: mode === "dark" ? themes.admin.dark : themes.admin.light,
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
};

export const useTheme = (): ThemeContextType => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
