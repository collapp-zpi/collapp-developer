import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { DraftPlugin } from '@prisma/client'
import { AuthLayout } from '../../../components/layouts/AuthLayout'
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
      <div className="container mx-auto">
        <button onClick={() => router.push('/panel/plugins/create')}>
          Add
        </button>
        {!plugins.length ? (
          <div>No plugins</div>
        ) : (
          <div className="bg-white px-8 py-4 rounded-3xl shadow-2xl">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-2 py-4">Name</th>
                  <th className="text-left px-2 py-4">Description</th>
                  <th className="text-left px-2 py-4">Status</th>
                  <th className="text-left px-2 py-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {plugins.map(
                  ({ id, name, description, status, date }: DraftPlugin) => (
                    <tr
                      key={id}
                      onClick={() => router.push(`/panel/plugins/${id}`)}
                      className="cursor-pointer border-t-2 border-gray-100"
                    >
                      <td className="px-2 py-4">{name}</td>
                      <td className="px-2 py-4">{description}</td>
                      <td className="px-2 py-4">{status}</td>
                      <td className="px-2 py-4">{date}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}

export default Plugins
