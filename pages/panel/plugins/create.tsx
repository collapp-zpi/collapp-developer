import { useRouter } from 'next/router'
import { AuthLayout } from '../../../layouts/AuthLayout'
import { PluginForm } from '../../../includes/plugins/components/PluginForm'

const CreatePlugin = () => {
  const router = useRouter()

  return (
    <AuthLayout>
      <PluginForm />
      <button type="button" onClick={() => router.push('/panel/plugins')}>
        Back
      </button>
    </AuthLayout>
  )
}

export default CreatePlugin
