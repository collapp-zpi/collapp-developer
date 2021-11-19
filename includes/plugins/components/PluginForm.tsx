import { InputText } from 'shared/components/input/InputText'
import { object, string } from 'yup'
import { InputTextarea } from 'shared/components/input/InputTextarea'
import { FiAlignCenter } from 'react-icons/fi'
import { BiText } from 'react-icons/bi'
import useApiForm, { FormProps } from 'shared/hooks/useApiForm'
import SubmitButton from 'shared/components/button/SubmitButton'
import { InputPhoto } from 'shared/components/input/InputPhoto'
import { toast } from 'react-hot-toast'
import { usePluginContext } from 'includes/plugins/components/PluginContext'
import { updatePlugin } from 'includes/plugins/endpoints'
import { generateKey } from 'shared/utils/object'
import { useSWRConfig } from 'swr'
import Form from 'shared/components/form/Form'
import { defaultPluginIcon } from 'shared/utils/defaultIcons'

const schema = object().shape({
  name: string().required().default(''),
  description: string().default(''),
  icon: string(),
})

export const PluginForm = ({
  initial: { icon, ...initial },
}: Omit<FormProps<typeof schema>, 'query'>) => {
  const { id, isPending } = usePluginContext()
  const { mutate } = useSWRConfig()

  const apiForm = useApiForm({
    query: updatePlugin(id),
    schema,
    initial,
    onSuccess: (_, methods) => {
      toast.success('The plugin has been updated successfully.')
      mutate(generateKey('plugin', id)).then(({ name, description }) => {
        methods.reset({ name, description, icon: undefined })
      })
    },
    onError: ({ message }) => {
      toast.error(
        `There has been an error while updating the plugin. ${
          !!message && `(${message})`
        }`,
      )
    },
  })

  return (
    <Form {...apiForm} className="flex flex-col">
      <div className="flex flex-col md:flex-row">
        <InputPhoto
          name="icon"
          image={icon || defaultPluginIcon}
          disabled={isPending}
        />
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
    </Form>
  )
}
