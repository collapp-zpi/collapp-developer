import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { AuthLayout } from 'layouts/AuthLayout'
import { useRouter } from 'next/router'
import { PluginForm } from 'includes/plugins/components/PluginForm'
import Button from 'shared/components/button/Button'
import { GoChevronLeft } from 'react-icons/go'
import { updatePlugin } from 'includes/plugins/endpoints'
import { PluginSizeForm } from 'includes/plugins/components/PluginSizeForm'
import { PluginDeleteForm } from 'includes/plugins/components/PluginDeleteForm'
import { PluginFileForm } from 'includes/plugins/components/PluginFileForm'
import { PluginSubmitForm } from 'includes/plugins/components/PluginSubmitForm'

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
  const {
    name,
    description,
    id,
    icon,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    isPending,
    source,
    published,
  } = plugin

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
          <h1 className="text-xl font-bold text-gray-500 mb-4">General info</h1>
          <PluginForm
            initial={{ name, description, icon }}
            query={updatePlugin(id)}
          />
        </div>
        <div className="bg-white px-8 py-8 rounded-3xl shadow-2xl mt-8">
          <h1 className="text-xl font-bold text-gray-500 mb-4">Plugin size</h1>
          <PluginSizeForm
            query={updatePlugin(id)}
            initial={{ minWidth, maxWidth, minHeight, maxHeight }}
          />
        </div>
        <div className="bg-white px-8 py-8 rounded-3xl shadow-2xl mt-8">
          <h1 className="text-xl font-bold text-gray-500 mb-4">Source code</h1>
          <PluginFileForm id={id} file={source} />
        </div>
        <div className="bg-white px-8 py-8 rounded-3xl shadow-2xl mt-8">
          <h1 className="text-xl font-bold text-gray-500 mb-4">Manage</h1>
          <PluginSubmitForm {...{ id, isPending }} />
          {!!published && (
            <div className="flex items-center mb-4">
              <div className="flex-grow flex flex-col mr-2">
                <h4 className="font-bold text-md">View published</h4>
                <h6 className="text-sm">
                  Go to the published version of the plugin
                </h6>
              </div>
              <Button
                color="light"
                onClick={
                  () => console.log(published.id) // TODO: redirect to published plugin
                }
              >
                View
              </Button>
            </div>
          )}
          <PluginDeleteForm {...{ id, name }} />
        </div>
      </div>
    </AuthLayout>
  )
}

export default Plugin
