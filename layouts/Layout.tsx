import { ComponentProps, ReactNode, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FiGithub, FiLogOut, FiSettings } from 'react-icons/fi'
import { Loading } from './Loading'
import classNames from 'classnames'
import useOnclickOutside from 'react-cool-onclickoutside'
import Button from 'shared/components/button/Button'
import { NavbarLogo } from 'shared/components/NavbarLogo'
import Link from 'next/link'
import { CgExtension, CgGlobeAlt } from 'react-icons/cg'

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
  const { status, data } = useSession()
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
        <Link href="/plugins" passHref>
          <div className="flex font-bold items-center cursor-pointer py-2 px-3 rounded-xl bg-black bg-opacity-0 hover:bg-opacity-5 focus:bg-opacity-5">
            <CgExtension className="mr-1.5" size="1.5em" />
            <span>Plugins</span>
          </div>
        </Link>
        <Link href="/published" passHref>
          <div className="flex font-bold items-center cursor-pointer py-2 px-3 mr-2 rounded-xl bg-black bg-opacity-0 hover:bg-opacity-5 focus:bg-opacity-5">
            <CgGlobeAlt className="mr-1.5" size="1.5em" />
            <span>Published</span>
          </div>
        </Link>
        <div className="ml-auto" />
        {status === 'unauthenticated' && (
          <Button
            onClick={() =>
              signIn('github', {
                callbackUrl: `${window.location.origin}/plugins`,
              })
            }
          >
            <FiGithub className="mr-2" />
            Sign in
          </Button>
        )}
        {status === 'authenticated' && data && (
          <div className="relative" ref={ref}>
            <div
              className="hover:bg-gray-200 cursor-pointer transition-colors rounded-xl p-1 h-full flex items-center justify-center"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
              <img
                src={data.user?.image ?? ''}
                className="bg-gray-300 w-8 h-8 rounded-25 shadow-lg"
              />
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
        )}
      </div>
      <div className="flex-grow pb-8">{children}</div>
    </main>
  )
}
