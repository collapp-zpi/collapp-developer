import Head from 'next/head'
import { signIn, signOut, useSession } from 'next-auth/react'
import Button from '../components/button/Button'

const Home = () => {
  const { data } = useSession()

  if (!data)
    return (
      <div>
        <Button
          onClick={() =>
            signIn('github', {
              callbackUrl: `${window.location.origin}/panel`,
            })
          }
        >
          Sign in
        </Button>
      </div>
    )

  return (
    <div>
      <Head>
        <title>Collapp Admin</title>
        <meta name="description" content="Collapp developer basic setup" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Button onClick={() => signOut()}>Sign out</Button>
      </main>
    </div>
  )
}

export default Home
