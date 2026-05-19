import {
  createRouter,
} from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'

export type RouterContext = {
  auth: {
    isAuthenticated: boolean
    user?: unknown
  }
}

export type AuthContextType = {
  isAuthenticated: boolean
  user?: unknown
}

export const router = createRouter({
  routeTree,
  context: {
    auth: undefined! as AuthContextType,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}