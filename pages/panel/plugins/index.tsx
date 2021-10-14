import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { DraftPlugin } from '@prisma/client'
import { AuthLayout } from '../../../layouts/AuthLayout'
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`${process.env.BASE_URL}/api/plugins`, {
    method: 'GET',
    headers: {
      ...(context?.req?.headers?.cookie && {
        cookie: context.req.headers.cookie,
      }),
    },
  })
  return {
    props: {
      plugins: await res.json(),
    },
  }
}

const Plugins = ({
  plugins,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  return (
    <AuthLayout>
      <Head>
        <title>Plugins</title>
      </Head>
      <main>
        <button onClick={() => router.push('/panel/plugins/create')}>
          Add
        </button>
        {!plugins.length ? (
          <div>No plugins</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {plugins.map(
                ({ id, name, description, status, date }: DraftPlugin) => (
                  <tr key={id}>
                    <td>{name}</td>
                    <td>{description}</td>
                    <td>{status}</td>
                    <td>{date}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        )}
      </main>
    </AuthLayout>
  )
}

export default Plugins
