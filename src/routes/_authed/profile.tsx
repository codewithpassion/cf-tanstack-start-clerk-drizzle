import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { useUser } from '@clerk/tanstack-react-start'

// Server function to fetch user data
const getUserData = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()

  return {
    userId,
    serverMessage: 'This data was fetched from the server',
  }
})

export const Route = createFileRoute('/_authed/profile')({
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Loading...</h1>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Client-Side User Data</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Name:</span>{' '}
            {user?.fullName || 'Not provided'}
          </p>
          <p>
            <span className="font-medium">Email:</span>{' '}
            {user?.primaryEmailAddress?.emailAddress || 'Not provided'}
          </p>
          <p>
            <span className="font-medium">User ID:</span> {user?.id}
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Server-Side Data</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">User ID from server:</span>{' '}
            {loaderData.userId}
          </p>
          <p>
            <span className="font-medium">Message:</span>{' '}
            {loaderData.serverMessage}
          </p>
        </div>
      </div>
    </div>
  )
}
