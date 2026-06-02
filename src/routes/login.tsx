import { Button, Card, Checkbox, Description, Label } from '@heroui/react'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import axios from 'axios'
import { useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { useApprovalService } from '../services/settings/approvalService'
import { useJenisPekerjaanService } from '../services/masterdata/jenisPekerjaanService'
import InputText from '../components/input/InputText'
import { useToast } from '../lib/useToast'

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
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const [form, setForm] = useState({
    username: '',
    password: ''
  })

  const navigate = useNavigate()


  const handleLogin = async () => {
    try {
      setLoading(true)
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login/`, {...form}, {
        headers: {
          "Content-Type": 'application/json'
        },
        withCredentials: true
      })
      const { user, access } = res.data
      await login(user, access)

      // toast.success({message: 'Success', description:'Login berhasil'})

      const res_apps = await useApprovalService.list()
      localStorage.setItem('approval', JSON.stringify(res_apps.data.results))

      const res_pekerjaan = await useJenisPekerjaanService.list()
      localStorage.setItem('j_pekerjaan', JSON.stringify(res_pekerjaan.data.results))
      
      
      // console.log(res.data);
      navigate({to: '/komersial/penawaran', replace: true})

    } catch {
      // console.log(error.message);
      toast.danger({message: 'Failed', description: 'Invalid username or password'})

    } finally {
      setLoading(false)
    }

  }





  return (
    <div className="h-screen flex justify-center items-center">
      <Card variant='secondary' className='max-w-sm w-full'>
        <Card.Header>
          <div className="">
            <div className="text-lg">Sign In</div>
            {/* <LogoAndroid /> */}
            <Label>Please login with your active account.</Label>
          </div>
        </Card.Header>
        <Card.Content>
          <form action={handleLogin} >
            <div className="flex flex-col gap-3">
              <InputText placeholder="jhondoes" label={'Username'} value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} />
              <InputText placeholder="Secret Code" type="password" label={'Password'} value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}/>
              <Checkbox>
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                  <Label>Remember me</Label>
                </Checkbox.Content>
              </Checkbox>
            </div>
            <div className="mt-5">
              <Button isDisabled={loading} type='submit' fullWidth>Start Login</Button>
              <div className="mt-3 flex justify-end">
                  <div className="text-right flex flex-col">
                    <Label>Lupa password?</Label>
                    <Description>Contact your administrator.</Description>
                  </div>
              </div>
            </div>
          </form>
        </Card.Content>
      </Card>
      {/* <div className="max-w-xs w-full">
          <div className="flex items-center justify-center">
            <Surface className='p-2 rounded-full bg-amber-400'>
              <FaceRobotSmile className='size-10' />
            </Surface>
          </div>
          <div className="text-2xl text-center mb-10">Login Smile</div>
          <div className="space-y-6">
            <TextField>
              <Input placeholder='Username' value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} />
            </TextField>
            <TextField>
              <Input type='password' placeholder='Password' value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
            </TextField>
            <Button onPress={handleLogin} className={'w-full'}>Login</Button>
          </div>
      </div> */}
    </div>
  )
}
