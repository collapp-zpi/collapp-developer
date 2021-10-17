import { useRouter } from 'next/router'
import { AuthLayout } from '../../../components/layout/AuthLayout'
import { PluginForm } from '../../../includes/plugins/components/PluginForm'
import { createPlugin } from '../../../includes/plugins/api/createPlugin'

const CreatePlugin = () => {
  const router = useRouter()

  return (
    <AuthLayout>
      <div className="container mx-auto">
        <button type="button" onClick={() => router.push('/panel/plugins')}>
          Back
        </button>
        <div className="bg-white px-8 py-8 rounded-3xl shadow-2xl">
          <PluginForm query={createPlugin} />
        </div>
      </div>
    </AuthLayout>
  )
}

export default CreatePlugin
