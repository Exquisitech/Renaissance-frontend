import { Metadata } from 'next'
import  LoginForm  from '@/components/login-form'

export const metadata: Metadata = {
  title: 'Login - Renaissance',
  description: 'Login to your Renaissance account',
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#050A1F]">
      <LoginForm />
    </main>
  )
}
