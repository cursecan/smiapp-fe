import { Button, Input, Label, TextField } from '@heroui/react'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import axios from 'axios'
import { use, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
      if (context.auth.isAuthenticated) {
          throw redirect({
            to: "/dashboard",
          });
        }
      },
})

function RouteComponent() {
  const {login} = useAuth()

  const [form, setForm] = useState({
    username: '',
    password: ''
  })

  const navigate = useNavigate()


  const handleLogin = async () => {
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login/`, {...form}, {
        headers: {
          "Content-Type": 'application/json'
        },
        withCredentials: true
      })
      // console.log(res.data);
      const { user, access } = res.data
      await login(user, access)

      navigate({to: '/dashboard', replace: true})

    } catch (error) {
      console.log(error);
    }
  }





  return (
    <div className=" h-screen bg-white flex justify-center items-center">
      <div className="max-w-xs w-full">
          <div className="space-y-6">
            <TextField>
              {/* <Label>Username</Label> */}
              <Input placeholder='Username' value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} />
            </TextField>
            <TextField>
              {/* <Label>Username</Label> */}
              <Input type='password' placeholder='Password' value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
            </TextField>
            <Button onPress={handleLogin} className={'w-full'}>Login</Button>
          </div>
      </div>
    </div>
  )
}
