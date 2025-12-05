import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export function ThemeToggle() {
	const { effectiveTheme, setTheme } = useTheme()

	const toggleTheme = () => {
		// Simple toggle: light <-> dark
		setTheme(effectiveTheme === "dark" ? "light" : "dark")
	}

	return (
		<button
			onClick={toggleTheme}
			className="p-2 hover:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
			aria-label={`Switch to ${effectiveTheme === "dark" ? "light" : "dark"} mode`}
			title={`Current theme: ${effectiveTheme} mode`}
		>
			{effectiveTheme === "dark" ? (
				<Moon size={20} className="text-yellow-300" />
			) : (
				<Sun size={20} className="text-yellow-500" />
			)}
		</button>
	)
}
