import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { AuthLayout } from '../../layouts/AuthLayout'
import { useRouter } from 'next/router'
import { PluginForm } from '../../includes/plugins/components/PluginForm'
import Button from '../../shared/components/button/Button'
import { GoChevronLeft } from 'react-icons/go'
import { toast } from 'react-hot-toast'
import { deletePlugin, updatePlugin } from 'includes/plugins/endpoints'
import useRequest, { RequestState } from 'shared/hooks/useRequest'
import { CgSpinner } from 'react-icons/cg'
import SubmitButton from 'shared/components/button/SubmitButton'

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

  const deleteRequest = useRequest(deletePlugin(id), {
    onSuccess: () => {
      toast.success('The plugin has been deleted successfully.')
      router.push('/plugins')
    },
    onError: ({ message }) => {
      toast.error(
        `There has been an error while deleting the plugin. ${
          !!message && `(${message})`
        }`,
      )
    },
  })

  const onSuccess = () => {
    toast.success('The plugin has been updated successfully.')
  }

  const onError = ({ message }: { message?: string }) => {
    toast.error(
      `There has been an error while updating the plugin. ${
        !!message && `(${message})`
      }`,
    )
  }

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
            {...{ onSuccess, onError }}
          >
            <div className="mt-4 flex">
              <Button onClick={deleteRequest.send} color="red-link">
                {deleteRequest.status === RequestState.Loading && (
                  <CgSpinner className="animate-spin mr-2 -ml-2" />
                )}
                Delete
              </Button>
              <SubmitButton className="ml-auto" />
            </div>
          </PluginForm>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Plugin
