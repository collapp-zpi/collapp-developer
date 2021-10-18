import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { useRouter } from 'next/router'
import { PluginForm } from '../../includes/plugins/components/PluginForm'
import { updatePlugin } from '../../includes/plugins/api/updatePlugin'
import Button from '../../components/button/Button'
import { GoChevronLeft } from 'react-icons/go'

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
  const { name, description, id } = plugin

  return (
    <AuthLayout>
      <Head>
        <title>Plugin</title>
      </Head>
      <div className="container mx-auto">
        <Button
          color="light"
          onClick={() => router.push('/plugins')}
          className="mb-4"
        >
          <GoChevronLeft className="mr-2 -ml-2" />
          Back
        </Button>
        <div className="bg-white px-8 py-8 rounded-3xl shadow-2xl">
          <PluginForm
            initial={{ name, description }}
            query={updatePlugin(id)}
          />
        </div>
      </div>
    </AuthLayout>
  )
}

export default Plugin
