import { useRouter } from 'next/router'
import { useState } from 'react'
import useRequest, { RequestState } from 'shared/hooks/useRequest'
import { deletePlugin } from 'includes/plugins/endpoints'
import { toast } from 'react-hot-toast'
import Button from 'shared/components/button/Button'
import Modal from 'shared/components/Modal'
import { InputTextPure } from 'shared/components/input/InputText'
import { RiErrorWarningLine } from 'react-icons/ri'
import { CgSpinner } from 'react-icons/cg'

export const PluginDeleteForm = ({ id, name }: { id: string; name: string }) => {
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

  const handleClose = () => {
    setModalOpen(false)
    setValue('')
  }

  return (
    <>
      <div className="flex items-center">
        <div className="flex-grow flex flex-col mr-2 text-red-700">
          <h4 className="font-bold text-md">Delete plugin</h4>
          <h6 className="text-sm">This operation is irreversible</h6>
        </div>
        <Button onClick={() => setModalOpen(true)} color="red-link">
          Delete
        </Button>
      </div>
      <Modal
        visible={isModalOpen || deleteRequest.status === RequestState.Loading}
        close={handleClose}
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
            <Button onClick={handleClose} className="ml-auto" color="light">
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
