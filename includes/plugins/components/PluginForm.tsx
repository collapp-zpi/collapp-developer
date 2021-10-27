import { InputText } from 'shared/components/input/InputText'
import { object, string } from 'yup'
import { UncontrolledForm } from 'shared/components/form/UncontrolledForm'
import { InputTextarea } from 'shared/components/input/InputTextarea'
import { FiAlignCenter } from 'react-icons/fi'
import { BiText } from 'react-icons/bi'
import { FormProps } from 'shared/hooks/useApiForm'
import SubmitButton from 'shared/components/button/SubmitButton'
import { InputPhoto } from 'shared/components/input/InputPhoto'
import { toast } from 'react-hot-toast'
import { usePluginContext } from 'includes/plugins/components/PluginContext'

const schema = object().shape({
  name: string().required().default(''),
  description: string().default(''),
  icon: string(),
})

export const PluginForm = ({
  query,
  initial: { icon, ...initial },
}: FormProps<typeof schema>) => {
  const { isPending } = usePluginContext()
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
    <UncontrolledForm
      {...{ schema, query, initial, onSuccess, onError }}
      className="flex flex-col"
    >
      <div className="flex flex-col md:flex-row">
        <InputPhoto name="icon" image={icon} disabled={isPending} />
        <div className="flex-grow flex flex-col">
          <InputText
            name="name"
            label="Name"
            icon={BiText}
            className="mt-2 md:mt-0"
            disabled={isPending}
          />
          <InputTextarea
            name="description"
            label="Description"
            className="mt-2"
            icon={FiAlignCenter}
            disabled={isPending}
          />
        </div>
      </div>
      <SubmitButton className="ml-auto mt-4" disabled={isPending} />
    </UncontrolledForm>
  )
}
