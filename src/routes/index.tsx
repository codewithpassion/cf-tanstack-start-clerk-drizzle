import { createFileRoute } from "@tanstack/react-router"
import {
	Zap,
	Server,
	Route as RouteIcon,
	Shield,
	Waves,
	Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

export const Route = createFileRoute("/")({ component: App })

function App() {
	const features = [
		{
			icon: <Zap className="size-12 text-cyan-400" />,
			title: "Powerful Server Functions",
			description:
				"Write server-side code that seamlessly integrates with your client components. Type-safe, secure, and simple.",
		},
		{
			icon: <Server className="size-12 text-cyan-400" />,
			title: "Flexible Server Side Rendering",
			description:
				"Full-document SSR, streaming, and progressive enhancement out of the box. Control exactly what renders where.",
		},
		{
			icon: <RouteIcon className="size-12 text-cyan-400" />,
			title: "API Routes",
			description:
				"Build type-safe API endpoints alongside your application. No separate backend needed.",
		},
		{
			icon: <Shield className="size-12 text-cyan-400" />,
			title: "Strongly Typed Everything",
			description:
				"End-to-end type safety from server to client. Catch errors before they reach production.",
		},
		{
			icon: <Waves className="size-12 text-cyan-400" />,
			title: "Full Streaming Support",
			description:
				"Stream data from server to client progressively. Perfect for AI applications and real-time updates.",
		},
		{
			icon: <Sparkles className="size-12 text-cyan-400" />,
			title: "Next Generation Ready",
			description:
				"Built from the ground up for modern web applications. Deploy anywhere JavaScript runs.",
		},
	]

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
			<section className="relative py-20 px-6 text-center overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
				<div className="relative max-w-5xl mx-auto">
					<div className="flex items-center justify-center gap-6 mb-6">
						<img
							src="/tanstack-circle-logo.png"
							alt="TanStack Logo"
							className="w-24 h-24 md:w-32 md:h-32"
						/>
						<h1 className="text-6xl md:text-7xl font-black text-slate-900 dark:text-white [letter-spacing:-0.08em]">
							<span className="text-slate-700 dark:text-gray-300">
								TANSTACK
							</span>{" "}
							<span className="bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
								START
							</span>
						</h1>
					</div>
					<p className="text-2xl md:text-3xl text-slate-700 dark:text-gray-300 mb-4 font-light">
						The framework for next generation AI applications
					</p>
					<p className="text-lg text-slate-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
						Full-stack framework powered by TanStack Router for React and Solid.
						Build modern applications with server functions, streaming, and type
						safety.
					</p>
					<div className="flex flex-col items-center gap-4">
						<Button
							asChild
							size="lg"
							className="bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/50"
						>
							<a
								href="https://tanstack.com/start"
								target="_blank"
								rel="noopener noreferrer"
							>
								Documentation
							</a>
						</Button>
						<p className="text-slate-600 dark:text-gray-400 text-sm mt-2">
							Begin your TanStack Start journey by editing{" "}
							<code className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-cyan-600 dark:text-cyan-400">
								/src/routes/index.tsx
							</code>
						</p>
					</div>
				</div>
			</section>

			<section className="py-16 px-6 max-w-7xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((feature, index) => (
						<Card
							key={index}
							className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border-slate-300 dark:border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
						>
							<CardHeader>
								<div className="mb-2">{feature.icon}</div>
								<CardTitle className="text-xl text-slate-900 dark:text-white">
									{feature.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-slate-600 dark:text-gray-400 leading-relaxed text-base">
									{feature.description}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
			</section>
		</div>
	)
}
