import { useRouter } from 'next/router'
import { AuthLayout } from '../../../components/layout/AuthLayout'
import { PluginForm } from '../../../includes/plugins/components/PluginForm'
import { createPlugin } from '../../../includes/plugins/api/createPlugin'
import Button from '../../../components/button/Button'
import { GoChevronLeft } from 'react-icons/go'

const CreatePlugin = () => {
  const router = useRouter()

  return (
    <AuthLayout>
      <div className="container mx-auto">
        <Button
          color="light"
          onClick={() => router.push('/panel/plugins')}
          className="mb-4"
        >
          <GoChevronLeft className="mr-2 -ml-2" />
          Back
        </Button>
        <div className="bg-white px-8 py-8 rounded-3xl shadow-2xl">
          <PluginForm query={createPlugin} />
        </div>
      </div>
    </AuthLayout>
  )
}

export default CreatePlugin
