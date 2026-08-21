import { Alert } from '@heroui/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/maintenance')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='flex p-10 justify-center'>
    <div className="max-w-xl w-full">
        <Alert status="warning">
            <Alert.Indicator />
            <Alert.Content>
            <Alert.Title>Page Under Maintenance</Alert.Title>
            <Alert.Description>
                Our services will be unavailable soon.
            </Alert.Description>
            </Alert.Content>
        </Alert>
    </div>
  </div>
}
