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
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Loading...</h1>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Authentication Status</h2>
          <div className="space-y-2 text-slate-700 dark:text-slate-300">
            <p>
              <span className="font-medium text-slate-900 dark:text-white">Authenticated:</span>{' '}
              <span className="text-green-600 dark:text-green-400">Yes</span>
            </p>
            <p>
              <span className="font-medium text-slate-900 dark:text-white">User ID:</span>{' '}
              <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-sm text-slate-800 dark:text-slate-200">
                {userId}
              </code>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Server Health</h2>
          <div className="space-y-2 text-slate-700 dark:text-slate-300">
            <p>
              <span className="font-medium text-slate-900 dark:text-white">Status:</span>{' '}
              <span className="text-green-600 dark:text-green-400">{loaderData.status}</span>
            </p>
            <p>
              <span className="font-medium text-slate-900 dark:text-white">Last Check:</span>{' '}
              {new Date(loaderData.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Protected Content</h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          This is a protected dashboard page. Only authenticated users can view
          this content.
        </p>
        <p className="text-slate-600 dark:text-slate-400">
          The authentication check happens on the server before this page loads,
          ensuring secure access control.
        </p>
      </div>
    </div>
  )
}
