import { ReactNode, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Button from '../form/Button'

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/')
  }, [router, status])

  if (status === 'loading') return <div>Loading...</div>

  return (
    <main className="bg-gray-100 flex-col h-full min-h-screen text-gray-500">
      <div className="bg-white mb-8 p-2 border-b border-gray-200 flex">
        <Button className="ml-auto" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
      <div className="flex-grow">{children}</div>
    </main>
  )
}
