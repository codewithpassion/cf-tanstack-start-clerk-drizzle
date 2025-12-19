import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { auth } from "@clerk/tanstack-react-start/server"
import { useUser } from "@clerk/tanstack-react-start"
import { Server } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Server function to fetch user data
const getUserData = createServerFn({ method: "GET" }).handler(async () => {
	const { userId } = await auth()

	return {
		userId,
		serverMessage: "This data was fetched from the server",
	}
})

export const Route = createFileRoute("/_authed/profile")({
	component: ProfilePage,
	loader: async () => {
		const data = await getUserData()
		return data
	},
})

function ProfilePage() {
	const { user, isLoaded } = useUser()
	const loaderData = Route.useLoaderData()

	if (!isLoaded) {
		return (
			<div className="max-w-2xl mx-auto p-6">
				<h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
					Loading...
				</h1>
			</div>
		)
	}

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
				User Profile
			</h1>

			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Client-Side User Data</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-slate-700 dark:text-slate-300">
					<p>
						<span className="font-medium text-slate-900 dark:text-white">
							Name:
						</span>{" "}
						{user?.fullName || "Not provided"}
					</p>
					<p>
						<span className="font-medium text-slate-900 dark:text-white">
							Email:
						</span>{" "}
						{user?.primaryEmailAddress?.emailAddress || "Not provided"}
					</p>
					<p>
						<span className="font-medium text-slate-900 dark:text-white">
							User ID:
						</span>{" "}
						{user?.id}
					</p>
				</CardContent>
			</Card>

			<Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
				<Server className="size-4 text-blue-600 dark:text-blue-400" />
				<AlertTitle>Server-Side Data</AlertTitle>
				<AlertDescription className="space-y-2 text-slate-700 dark:text-slate-300">
					<p>
						<span className="font-medium text-slate-900 dark:text-white">
							User ID from server:
						</span>{" "}
						{loaderData.userId}
					</p>
					<p>
						<span className="font-medium text-slate-900 dark:text-white">
							Message:
						</span>{" "}
						{loaderData.serverMessage}
					</p>
				</AlertDescription>
			</Alert>
		</div>
	)
}
