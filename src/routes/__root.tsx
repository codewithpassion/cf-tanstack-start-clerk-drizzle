import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ClerkProvider } from '@clerk/tanstack-react-start'

import Header from '../components/Header'

import appCss from '../styles.css?url'
import { AuthProvider } from '@/contexts/auth-context'
import { ThemeProvider } from '@/contexts/theme-context'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],

  }),

  shellComponent: RootDocument,
  notFoundComponent: () => <div>404 - Not Found</div>,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <AuthProvider>
        <ThemeProvider>
          <html lang="en">
            <head>
              <script dangerouslySetInnerHTML={{
                __html: `
                  (function() {
                    try {
                      var storageKey = 'theme';
                      var className = 'dark';
                      var element = document.documentElement;
                      var stored = localStorage.getItem(storageKey);
                      var isDark = stored === 'dark' || (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

                      if (isDark) {
                        element.classList.add(className);
                      }
                    } catch (e) {}
                  })();
                `
              }} />
              <HeadContent />
            </head>
            <body>
              <Header />
              {children}
              <TanStackDevtools
                config={{
                  position: 'bottom-right',
                }}
                plugins={[
                  {
                    name: 'Tanstack Router',
                    render: <TanStackRouterDevtoolsPanel />,
                  },
                ]}
              />
              <Scripts />
            </body>
          </html>
        </ThemeProvider>
      </AuthProvider>
    </ClerkProvider>
  )
}
