import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { signIn, signOut, useSession } from 'next-auth/react'

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

const Home = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const { data } = useSession()

  if (!data)
    return (
      <div className={styles.container}>
        <button onClick={() => signIn('github')}>Sign in</button>
      </div>
    )

  console.log(props.developers)
  return (
    <div className={styles.container}>
      <Head>
        <title>Collapp Admin</title>
        <meta name="description" content="Collapp developer basic setup" />
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
