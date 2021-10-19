import { InputText } from '../../../shared/components/input/InputText'
import { object, string } from 'yup'
import { UncontrolledForm } from '../../../shared/components/form/UncontrolledForm'
import SubmitButton from '../../../shared/components/button/SubmitButton'
import { InputTextarea } from '../../../shared/components/input/InputTextarea'
import { FiAlignCenter } from 'react-icons/fi'
import { BiText } from 'react-icons/bi'
import { FormProps } from '../../../shared/hooks/useApiForm'

const schema = object().shape({
  name: string().required(),
  description: string(),
})

export const PluginForm = ({
  query,
  initial,
  onSuccess,
  onError,
  children,
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
    <SubmitButton className="mt-4 ml-auto" />
    {children}
  </UncontrolledForm>
)
