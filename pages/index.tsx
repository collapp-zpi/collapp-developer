import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { signIn, signOut, useSession } from 'next-auth/react'

const Home = () => {
  const { data } = useSession()

  if (!data)
    return (
      <div className={styles.container}>
        <button
          onClick={() =>
            signIn('github', {
              callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/panel`,
            })
          }
        >
          Sign in
        </button>
      </div>
    )

  return (
    <div className={styles.container}>
      <Head>
        <title>Collapp Admin</title>
        <meta name="description" content="Collapp developer basic setup" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <button onClick={() => signOut()}>Sign out</button>
      </main>
    </div>
  )
}

export default Home
