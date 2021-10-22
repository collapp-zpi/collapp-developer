import { ComponentProps, ReactNode, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FiLogOut, FiSettings, FiCopy, FiGithub } from 'react-icons/fi'
import { Loading } from './Loading'
import classNames from 'classnames'
import useOnclickOutside from 'react-cool-onclickoutside'
import Button from 'shared/components/button/Button'
import { NavbarLogo } from 'shared/components/NavbarLogo'

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

export const Layout = ({ children }: { children: ReactNode }) => {
  const { status } = useSession()
  const router = useRouter()
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const ref = useOnclickOutside(() => {
    setDropdownOpen(false)
  })

  if (status === 'loading') return <Loading />

  return (
    <main className="bg-gray-100 flex flex-col h-full min-h-screen text-gray-500">
      <div className="bg-white mb-8 p-2 border-b border-gray-200 flex">
        <NavbarLogo />
        {status === 'unauthenticated' && (
          <Button
            onClick={() =>
              signIn('github', {
                callbackUrl: `${window.location.origin}/plugins`,
              })
            }
            className="ml-auto"
          >
            <FiGithub className="mr-2" />
            Sign in
          </Button>
        )}
        {status === 'authenticated' && (
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
              <DropdownButton onClick={() => router.push('/plugins')}>
                <FiCopy className="mr-2" />
                <span>Plugins</span>
              </DropdownButton>
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
        )}
      </div>
      <div className="flex-grow pb-8">{children}</div>
    </main>
  )
}
