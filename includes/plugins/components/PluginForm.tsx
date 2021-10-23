import { InputText } from 'shared/components/input/InputText'
import { mixed, object, string } from 'yup'
import { UncontrolledForm } from 'shared/components/form/UncontrolledForm'
import { InputTextarea } from 'shared/components/input/InputTextarea'
import { FiAlignCenter } from 'react-icons/fi'
import { BiText } from 'react-icons/bi'
import { FormProps } from 'shared/hooks/useApiForm'
import SubmitButton from 'shared/components/button/SubmitButton'
import { InputPhoto } from 'shared/components/input/InputPhoto'

const schema = object().shape({
  name: string().required().default(''),
  description: string().default(''),
  icon: mixed().nullable().default(null),
})

export const PluginForm = ({
  query,
  initial,
  onSuccess,
  onError,
}: FormProps<typeof schema>) => (
  <UncontrolledForm
    {...{ schema, query, initial, onSuccess, onError }}
    className="flex flex-col"
  >
    <InputText name="name" label="Name" icon={BiText} />
    <InputTextarea
      name="description"
      label="Description"
      className="mt-2"
      icon={FiAlignCenter}
    />
    <InputPhoto name="icon">
      {({ open, getRootProps }) => (
        <div {...getRootProps()} onClick={open}>
          Hello from the other side
        </div>
      )}
    </InputPhoto>
    <SubmitButton className="ml-auto mt-4" />
  </UncontrolledForm>
)
