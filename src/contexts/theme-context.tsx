import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
	theme: Theme
	setTheme: (theme: Theme) => void
	effectiveTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window !== "undefined") {
			return (localStorage.getItem("theme") as Theme) || "system"
		}
		return "system"
	})

	const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">("light")

	useEffect(() => {
		const root = document.documentElement

		const getSystemTheme = (): "light" | "dark" => {
			return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
		}

		const updateEffectiveTheme = () => {
			const newEffectiveTheme = theme === "system" ? getSystemTheme() : theme
			setEffectiveTheme(newEffectiveTheme)

			if (newEffectiveTheme === "dark") {
				root.classList.add("dark")
			} else {
				root.classList.remove("dark")
			}
		}

		updateEffectiveTheme()

		// Listen for system theme changes if theme is set to "system"
		if (theme === "system") {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
			const listener = () => updateEffectiveTheme()
			mediaQuery.addEventListener("change", listener)
			return () => mediaQuery.removeEventListener("change", listener)
		}
	}, [theme])

	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("theme", theme)
		}
	}, [theme])

	return (
		<ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export function useTheme() {
	const context = useContext(ThemeContext)
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider")
	}
	return context
}
