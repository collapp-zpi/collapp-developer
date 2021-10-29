import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { DraftPlugin } from '@prisma/client'
import { AuthLayout } from 'layouts/AuthLayout'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { defaultPluginIcon } from 'config/defaultIcons'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`${process.env.BASE_URL}/api/published`, {
    method: 'GET',
    headers: {
      ...(context?.req?.headers?.cookie && {
        cookie: context.req.headers.cookie,
      }),
    },
  })
  return {
    props: {
      published: await res.json(),
    },
  }
}

const Published = ({
  published,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  return (
    <AuthLayout>
      <Head>
        <title>Published</title>
      </Head>
      <div className="container mx-auto">
        {!published.length ? (
          <div>No plugins</div>
        ) : (
          <div className="bg-white px-8 py-4 rounded-3xl shadow-2xl">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Description</th>
                  <th className="text-left p-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {published.map(
                  ({ id, name, description, updatedAt, icon }: DraftPlugin) => (
                    <tr
                      key={id}
                      onClick={() => router.push(`/published/${id}`)}
                      className="cursor-pointer border-t-2 border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 flex items-center">
                        <img
                          src={icon || defaultPluginIcon}
                          className="shadow-lg w-8 h-8 mr-3 bg-gray-200 rounded-25"
                          alt="Plugin icon"
                        />
                        {name}
                      </td>
                      <td className="p-4">{description}</td>
                      <td className="p-4">{dayjs(updatedAt).format('LLL')}</td>
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

export default Published
