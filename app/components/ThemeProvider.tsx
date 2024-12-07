import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
	theme: Theme;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window !== "undefined") {
			const savedTheme = localStorage.getItem("theme") as Theme;
			if (savedTheme) return savedTheme;

			// Check system preference
			const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";
			return systemPreference;
		}
		return "light";
	});

	useEffect(() => {
		const root = window.document.documentElement;
		const isDark = theme === "dark";

		root.classList.remove(isDark ? "light" : "dark");
		root.classList.add(theme);
		root.style.colorScheme = theme;

		localStorage.setItem("theme", theme);
	}, [theme]);

	// Listen for system theme changes
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = (e: MediaQueryListEvent) => {
			setTheme(e.matches ? "dark" : "light");
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	const toggleTheme = () => {
		setTheme((prev) => (prev === "dark" ? "light" : "dark"));
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};
