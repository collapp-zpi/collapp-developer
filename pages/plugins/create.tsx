import { useRouter } from 'next/router'
import { AuthLayout } from '../../layouts/AuthLayout'
import { PluginForm } from '../../includes/plugins/components/PluginForm'
import Button from '../../shared/components/button/Button'
import { GoChevronLeft } from 'react-icons/go'
import { toast } from 'react-hot-toast'
import { createPlugin } from 'includes/plugins/endpoints'

const CreatePlugin = () => {
  const router = useRouter()

  const onSuccess = (data) => {
    console.log(data)
    toast.success('The plugin has been created successfully.')
  }

  const onError = ({ message }: { message?: string }) => {
    toast.error(
      `There has been an error while creating the plugin. ${
        !!message && `(${message})`
      }`,
    )
  }

  return (
    <AuthLayout>
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
          <PluginForm query={createPlugin} {...{ onSuccess, onError }} />
        </div>
      </div>
    </AuthLayout>
  )
}

export default CreatePlugin
