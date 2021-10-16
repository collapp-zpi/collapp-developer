import { useRouter } from 'next/router'
import { AuthLayout } from '../../../layouts/AuthLayout'
import { PluginForm } from '../../../includes/plugins/components/PluginForm'
import { createPlugin } from '../../../includes/plugins/api/createPlugin'

const CreatePlugin = () => {
  const router = useRouter()

  return (
    <AuthLayout>
      <PluginForm query={createPlugin} />
      <button type="button" onClick={() => router.push('/panel/plugins')}>
        Back
      </button>
    </AuthLayout>
  )
}

export default CreatePlugin
