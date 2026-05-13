import { Button, Input, Label, Surface, TextField } from '@heroui/react'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import axios from 'axios'
import { use, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { FaceRobotSmile } from '@gravity-ui/icons'

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
      const { user, access } = res.data
      await login(user, access)
      
      console.log(res.data);
      navigate({to: '/komersial/penawaran', replace: true})

    } catch (error) {
      console.log(error);
    }
  }





  return (
    <div className=" h-screen bg-linear-150 from-neutral-100 to-sky-500  flex justify-center items-center">
      <div className="max-w-xs w-full">
          <div className="flex items-center justify-center">
            <Surface className='p-2 rounded-full bg-amber-400'>
              <FaceRobotSmile className='size-10' />
            </Surface>
          </div>
          <div className="text-2xl text-center mb-10">Login Smile</div>
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
