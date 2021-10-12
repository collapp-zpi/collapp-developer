import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { signOut, useSession } from 'next-auth/react'
import { signIn } from 'next-auth/react'
import { FormEvent, useState } from 'react'
import { RedirectableProviderType } from 'next-auth/providers'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`${process.env.BASE_URL}/api/developers`, {
    method: 'GET',
    headers: {
      ...(context?.req?.headers?.cookie && {
        cookie: context.req.headers.cookie,
      }),
    },
  })
  const developers = await res.json()

  return {
    props: { developers },
  }
}

enum Status {
  Loading,
  Error,
  Success,
}

const Home = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const { data } = useSession()
  const [status, setStatus] = useState<Status | null>(null)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus(Status.Loading)
    const response = await signIn<RedirectableProviderType>('email', {
      redirect: false,
      email,
    })

    if (!response) return
    if (response.error) {
      setStatus(Status.Error)
    } else {
      setStatus(Status.Success)
    }
  }

  if (!data) {
    if (status == null || status === Status.Error) {
      return (
        <div className={styles.container}>
          {status != null && <h1>There was an authorization error.</h1>}
          <form onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <button type="submit">Sign in</button>
          </form>
        </div>
      )
    }

    if (status === Status.Success)
      return (
        <div className={styles.container}>
          <h1>Check your email inbox</h1>
        </div>
      )

    return (
      <div className={styles.container}>
        <h1>Loading...</h1>
      </div>
    )
  }

  console.log(props.developers)
  return (
    <div className={styles.container}>
      <Head>
        <title>Collapp Admin</title>
        <meta name="description" content="Collapp admin basic setup" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <button onClick={() => signOut()}>Sign out</button>
        <div>{props.developers.length}</div>
      </main>
    </div>
  )
}

export default Home
