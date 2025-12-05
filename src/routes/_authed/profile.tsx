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
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Loading...</h1>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">User Profile</h1>

      <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6 mb-6 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Client-Side User Data</h2>
        <div className="space-y-2 text-slate-700 dark:text-slate-300">
          <p>
            <span className="font-medium text-slate-900 dark:text-white">Name:</span>{' '}
            {user?.fullName || 'Not provided'}
          </p>
          <p>
            <span className="font-medium text-slate-900 dark:text-white">Email:</span>{' '}
            {user?.primaryEmailAddress?.emailAddress || 'Not provided'}
          </p>
          <p>
            <span className="font-medium text-slate-900 dark:text-white">User ID:</span> {user?.id}
          </p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Server-Side Data</h2>
        <div className="space-y-2 text-slate-700 dark:text-slate-300">
          <p>
            <span className="font-medium text-slate-900 dark:text-white">User ID from server:</span>{' '}
            {loaderData.userId}
          </p>
          <p>
            <span className="font-medium text-slate-900 dark:text-white">Message:</span>{' '}
            {loaderData.serverMessage}
          </p>
        </div>
      </div>
    </div>
  )
}
