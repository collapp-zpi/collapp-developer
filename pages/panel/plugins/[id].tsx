import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { AuthLayout } from '../../../layouts/AuthLayout'
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const res = await fetch(`${process.env.BASE_URL}/api/plugins/${id}`, {
    method: 'GET',
    headers: {
      ...(context?.req?.headers?.cookie && {
        cookie: context.req.headers.cookie,
      }),
    },
  })
  return {
    props: {
      plugin: await res.json(),
    },
  }
}

const Plugin = ({
  plugin,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  console.log(plugin)
  return (
    <AuthLayout>
      <Head>
        <title>Plugin</title>
      </Head>
      <main>
        <button type="button" onClick={() => router.push('/panel/plugins')}>
          Back
        </button>
      </main>
    </AuthLayout>
  )
}

export default Plugin
