import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { AuthLayout } from 'layouts/AuthLayout'
import { useRouter } from 'next/router'
import { PluginForm } from 'includes/plugins/components/PluginForm'
import Button from 'shared/components/button/Button'
import { GoChevronLeft } from 'react-icons/go'
import { toast } from 'react-hot-toast'
import { deletePlugin, updatePlugin } from 'includes/plugins/endpoints'
import useRequest, { RequestState } from 'shared/hooks/useRequest'
import { CgSpinner } from 'react-icons/cg'
import { PluginSizeForm } from 'includes/plugins/components/PluginSizeForm'
import { useState } from 'react'
import Modal from 'shared/components/Modal'
import { InputTextPure } from 'shared/components/input/InputText'
import { RiErrorWarningLine } from 'react-icons/ri'

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
          <PluginForm
            initial={{ name, description, icon }}
            query={updatePlugin(id)}
          />
        </div>
        <div className="bg-white px-8 py-8 rounded-3xl shadow-2xl mt-8">
          <PluginSizeForm
            query={updatePlugin(id)}
            initial={{ minWidth, maxWidth, minHeight, maxHeight }}
          />
        </div>
        <div className="bg-white px-8 py-8 rounded-3xl shadow-2xl mt-8">
          <DeleteForm {...{ id, name }} />
        </div>
      </div>
    </AuthLayout>
  )
}

export default Plugin

const DeleteForm = ({ id, name }: { id: string; name: string }) => {
  const router = useRouter()
  const [isModalOpen, setModalOpen] = useState(false)
  const [value, setValue] = useState('')
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

  const verification = name.replace(/\s+/g, '-').toLowerCase()

  return (
    <>
      <Button onClick={() => setModalOpen(true)} color="red-link">
        Delete
      </Button>
      <Modal
        visible={isModalOpen || deleteRequest.status === RequestState.Loading}
      >
        <div className="p-4">
          <h1 className="text-2xl font-bold text-red-500">Caution!</h1>
          <p>
            This operation is irreversible. This will permanently delete the
            plugin.
          </p>
          <p className="mt-4">
            Please type <b>{verification}</b> to confirm.
          </p>
          <InputTextPure
            icon={RiErrorWarningLine}
            className="mt-2"
            label="Verification"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="flex mt-2">
            <Button
              onClick={() => {
                setModalOpen(false)
                setValue('')
              }}
              className="ml-auto"
              color="light"
            >
              Cancel
            </Button>
            <Button
              onClick={deleteRequest.send}
              disabled={value !== verification}
              className="ml-2"
              color="red"
            >
              {deleteRequest.status === RequestState.Loading && (
                <CgSpinner className="animate-spin mr-2 -ml-2" />
              )}
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
