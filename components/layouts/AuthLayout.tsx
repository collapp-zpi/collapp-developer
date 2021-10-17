import { ReactNode, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/')
  }, [router, status])

  if (status === 'loading') return <div>Loading...</div>

  return (
    <div>
      <div>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
      <div>{children}</div>
    </div>
  )
}
