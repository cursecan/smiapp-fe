import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import { AuthProvider, useAuth } from './auth/AuthProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


const queryClient = new QueryClient()


const InnerApp = () => {
  const auth = useAuth()
  const router = createRouter({ routeTree })

  if (auth.loading) {
    return <div className="">Loading...</div>
  }
  
  return (
    <RouterProvider router={router} context={{auth}}>
    </RouterProvider>
  )
}




function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <InnerApp />
        </AuthProvider>

      </QueryClientProvider>
    </>
  )
}

export default App
