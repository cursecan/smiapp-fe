import { createFileRoute, Link } from '@tanstack/react-router'
import { redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  // component: Index,
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: "/dashboard",
      });

    }

    throw redirect({
      to: '/login'
    })
  }
})
