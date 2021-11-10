import { useRouter } from 'next/router'
import { Layout } from 'layouts/Layout'
import Button from 'shared/components/button/Button'
import { GoChevronLeft } from 'react-icons/go'
import { toast } from 'react-hot-toast'
import { createPlugin } from 'includes/plugins/endpoints'
import { DraftPlugin } from '@prisma/client'
import { UncontrolledForm } from 'shared/components/form/UncontrolledForm'
import { object, string } from 'yup'
import { InputText } from 'shared/components/input/InputText'
import { BiText } from 'react-icons/bi'
import { InputTextarea } from 'shared/components/input/InputTextarea'
import { FiAlignCenter } from 'react-icons/fi'
import SubmitButton from 'shared/components/button/SubmitButton'
import { withAuth } from 'shared/hooks/useAuth'

const schema = object().shape({
  name: string().required().default(''),
  description: string().default(''),
})

const CreatePlugin = () => {
  const router = useRouter()

  const onSuccess = (data: DraftPlugin) => {
    toast.success('The plugin has been created successfully.')
    router.push(`/plugins/${data.id}`)
  }

  const onError = ({ message }: { message?: string }) => {
    toast.error(
      `There has been an error while creating the plugin. ${
        !!message && `(${message})`
      }`,
    )
  }

  return (
    <Layout>
      <Button
        color="light"
        onClick={() => router.push('/plugins')}
        className="mb-4"
      >
        <GoChevronLeft className="mr-2 -ml-2" />
        Back
      </Button>
      <div className="bg-white px-8 py-8 rounded-3xl shadow-2xl">
        <UncontrolledForm
          schema={schema}
          query={createPlugin}
          {...{ onSuccess, onError }}
        >
          <InputText
            name="name"
            label="Name"
            icon={BiText}
            className="mt-2 md:mt-0"
          />
          <InputTextarea
            name="description"
            label="Description"
            className="mt-2"
            icon={FiAlignCenter}
          />
          <SubmitButton className="ml-auto mt-4" />
        </UncontrolledForm>
      </div>
    </Layout>
  )
}

export default withAuth(CreatePlugin)
