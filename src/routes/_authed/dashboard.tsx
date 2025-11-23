import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { useAuth } from '@clerk/tanstack-react-start'

// Server function to check API health with auth
const checkApiHealth = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()

  // You could make an authenticated API call here
  return {
    status: 'ok',
    userId,
    timestamp: new Date().toISOString(),
  }
})

export const Route = createFileRoute('/_authed/dashboard')({
  component: DashboardPage,
  loader: async () => {
    const health = await checkApiHealth()
    return health
  },
})

function DashboardPage() {
  const { userId, isLoaded } = useAuth()
  const loaderData = Route.useLoaderData()

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Loading...</h1>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Authenticated:</span>{' '}
              <span className="text-green-600">Yes</span>
            </p>
            <p>
              <span className="font-medium">User ID:</span>{' '}
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                {userId}
              </code>
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Server Health</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Status:</span>{' '}
              <span className="text-green-600">{loaderData.status}</span>
            </p>
            <p>
              <span className="font-medium">Last Check:</span>{' '}
              {new Date(loaderData.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Protected Content</h2>
        <p className="text-gray-700 mb-4">
          This is a protected dashboard page. Only authenticated users can view
          this content.
        </p>
        <p className="text-gray-600">
          The authentication check happens on the server before this page loads,
          ensuring secure access control.
        </p>
      </div>
    </div>
  )
}
