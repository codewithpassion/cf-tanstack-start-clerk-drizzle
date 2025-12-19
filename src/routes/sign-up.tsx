import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { SignUp, useAuth } from "@clerk/tanstack-react-start"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const Route = createFileRoute("/sign-up")({
	component: SignUpPage,
	validateSearch: (search: Record<string, unknown>) => {
		return {
			redirect: (search.redirect as string) || "/",
		}
	},
})

function SignUpPage() {
	const { isSignedIn } = useAuth()
	const navigate = useNavigate()
	const { redirect } = Route.useSearch()

	useEffect(() => {
		// If user is already signed in, redirect them
		if (isSignedIn) {
			navigate({ to: redirect as string })
		}
	}, [isSignedIn, navigate, redirect])

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl text-center">Sign Up</CardTitle>
				</CardHeader>
				<CardContent>
					<SignUp
						routing="path"
						path="/sign-up"
						signInUrl="/sign-in"
						afterSignUpUrl={redirect as string}
					/>
				</CardContent>
			</Card>
		</div>
	)
}
