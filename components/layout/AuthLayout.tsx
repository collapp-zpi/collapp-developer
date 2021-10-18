import { ComponentProps, ReactNode, useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FiLogOut, FiSettings } from 'react-icons/fi'
import { Loading } from './Loading'
import classNames from 'classnames'
import useOnclickOutside from 'react-cool-onclickoutside'

const DropdownButton = ({
  children,
  className,
  ...props
}: ComponentProps<'div'>) => (
  <div
    className={classNames(
      'flex text-sm items-center py-2 px-3 cursor-pointer hover:bg-blue-500 hover:text-white rounded-md whitespace-nowrap transition-colors',
      className,
    )}
    {...props}
  >
    {children}
  </div>
)

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { status } = useSession()
  const router = useRouter()
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const ref = useOnclickOutside(() => {
    setDropdownOpen(false)
  })

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/')
  }, [router, status])

  if (status === 'unauthenticated') return null
  if (status === 'loading') return <Loading />

  return (
    <main className="bg-gray-100 flex flex-col h-full min-h-screen text-gray-500">
      <div className="bg-white mb-8 p-2 border-b border-gray-200 flex">
        <div className="ml-auto relative" ref={ref}>
          <div
            className="hover:bg-gray-200 cursor-pointer transition-colors rounded-xl p-1 h-full flex items-center justify-center"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            <div className="bg-red-500 w-8 h-8 rounded-full" />
          </div>
          <div
            className={classNames(
              'absolute -bottom-1 right-0 transform translate-y-full bg-white border border-gray-200 rounded-lg p-1 shadow-lg transition-opacity',
              !isDropdownOpen && 'pointer-events-none opacity-0',
            )}
          >
            <DropdownButton onClick={() => router.push('/settings')}>
              <FiSettings className="mr-2" />
              <span>Settings</span>
            </DropdownButton>
            <DropdownButton onClick={() => signOut()}>
              <FiLogOut className="mr-2" />
              <span>Sign out</span>
            </DropdownButton>
          </div>
        </div>
      </div>
      <div className="flex-grow">{children}</div>
    </main>
  )
}
