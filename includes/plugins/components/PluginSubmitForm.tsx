import { useRouter } from 'next/router'
import { useState } from 'react'
import useRequest from 'shared/hooks/useRequest'
import { submitPlugin } from 'includes/plugins/endpoints'
import { toast } from 'react-hot-toast'
import Button from 'shared/components/button/Button'
import Modal from 'shared/components/Modal'
import { CgSpinner } from 'react-icons/cg'

type Props = {
  id: string
  isPending: boolean
}

export const PluginSubmitForm = ({ id, isPending }: Props) => {
  const router = useRouter()
  const [isModalOpen, setModalOpen] = useState(false)
  const deleteRequest = useRequest(submitPlugin(id), {
    onSuccess: () => {
      toast.success('The plugin has been submitted successfully.')
      router.push('/plugins')
    },
    onError: ({ message }) => {
      toast.error(
        `There has been an error while submitting the plugin. ${
          !!message && `(${message})`
        }`,
      )
    },
  })

  const handleClose = () => {
    setModalOpen(false)
  }

  return (
    <>
      <div className="flex items-center mb-4">
        <div className="flex-grow flex flex-col mr-2">
          <h4 className="font-bold text-md">Submit plugin</h4>
          {isPending && (
            <h6 className="text-sm">Changes are being reviewed by an admin</h6>
          )}
          {!isPending && (
            <h6 className="text-sm">Changes have to be approved by an admin</h6>
          )}
        </div>
        <Button disabled={isPending} onClick={() => setModalOpen(true)}>
          Submit
        </Button>
      </div>
      {!isPending && (
        <Modal
          visible={isModalOpen || deleteRequest.isLoading}
          close={handleClose}
        >
          <div className="p-4">
            <h1 className="text-2xl font-bold text-red-500">Caution!</h1>
            <p>
              You will not be able to make any more changes to this plugin,
              until the request is processed.
            </p>
            <p className="mt-2 font-bold">Are you sure you want to proceed?</p>
            <div className="flex mt-2">
              <Button onClick={handleClose} className="ml-auto" color="light">
                Cancel
              </Button>
              <Button
                onClick={deleteRequest.send}
                disabled={deleteRequest.isLoading}
                className="ml-2"
              >
                {deleteRequest.isLoading && (
                  <CgSpinner className="animate-spin mr-2 -ml-2" />
                )}
                Submit
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
