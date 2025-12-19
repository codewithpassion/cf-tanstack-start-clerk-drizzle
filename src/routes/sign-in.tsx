import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { SignIn, useAuth } from "@clerk/tanstack-react-start"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const Route = createFileRoute("/sign-in")({
	component: SignInPage,
	validateSearch: (search: Record<string, unknown>) => {
		return {
			redirect: (search.redirect as string) || "/",
		}
	},
})

function SignInPage() {
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
					<CardTitle className="text-2xl text-center">Sign In</CardTitle>
				</CardHeader>
				<CardContent>
					<SignIn
						routing="path"
						path="/sign-in"
						signUpUrl="/sign-up"
						afterSignInUrl={redirect as string}
					/>
				</CardContent>
			</Card>
		</div>
	)
}
