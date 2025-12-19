import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
	const { effectiveTheme, setTheme } = useTheme()

	const toggleTheme = () => {
		// Simple toggle: light <-> dark
		setTheme(effectiveTheme === "dark" ? "light" : "dark")
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleTheme}
			aria-label={`Switch to ${effectiveTheme === "dark" ? "light" : "dark"} mode`}
			title={`Current theme: ${effectiveTheme} mode`}
		>
			{effectiveTheme === "dark" ? (
				<Moon className="size-5 text-yellow-300" />
			) : (
				<Sun className="size-5 text-yellow-500" />
			)}
		</Button>
	)
}
