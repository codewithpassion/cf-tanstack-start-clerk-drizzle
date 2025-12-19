import { Link } from "@tanstack/react-router"

import { Home, Menu, User, LayoutDashboard } from "lucide-react"
import {
	SignedIn,
	SignedOut,
	UserButton,
	SignInButton,
} from "@clerk/tanstack-react-start"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"

export default function Header() {
	return (
		<>
			<header className="p-4 flex items-center justify-between bg-gray-800 text-white shadow-lg">
				<div className="flex items-center">
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" aria-label="Open menu">
								<Menu className="size-6" />
							</Button>
						</SheetTrigger>
						<SheetContent
							side="left"
							className="w-80 bg-gray-900 text-white border-gray-700"
						>
							<SheetHeader className="border-b border-gray-700">
								<SheetTitle className="text-white">Navigation</SheetTitle>
							</SheetHeader>

							<nav className="flex-1 p-4 overflow-y-auto">
								<Link
									to="/"
									className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
									activeProps={{
										className:
											"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
									}}
								>
									<Home className="size-5" />
									<span className="font-medium">Home</span>
								</Link>

								{/* Auth Protected Routes */}
								<SignedIn>
									<Link
										to="/dashboard"
										className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
										activeProps={{
											className:
												"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
										}}
									>
										<LayoutDashboard className="size-5" />
										<span className="font-medium">Dashboard</span>
									</Link>

									<Link
										to="/profile"
										className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
										activeProps={{
											className:
												"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
										}}
									>
										<User className="size-5" />
										<span className="font-medium">Profiles</span>
									</Link>
								</SignedIn>
							</nav>
						</SheetContent>
					</Sheet>
					<h1 className="ml-4 text-xl font-semibold">
						<Link to="/">
							<img
								src="/tanstack-word-logo-white.svg"
								alt="TanStack Logo"
								className="h-10"
							/>
						</Link>
					</h1>
				</div>

				<div className="flex items-center gap-4">
					<ThemeToggle />
					<SignedOut>
						<SignInButton mode="modal">
							<Button className="bg-cyan-600 hover:bg-cyan-700">Sign In</Button>
						</SignInButton>
					</SignedOut>
					<SignedIn>
						<UserButton afterSignOutUrl="/" />
					</SignedIn>
				</div>
			</header>
		</>
	)
}
