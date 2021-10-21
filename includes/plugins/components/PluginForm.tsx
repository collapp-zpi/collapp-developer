import { InputText } from 'shared/components/input/InputText'
import { object, string } from 'yup'
import { UncontrolledForm } from 'shared/components/form/UncontrolledForm'
import { InputTextarea } from 'shared/components/input/InputTextarea'
import { FiAlignCenter } from 'react-icons/fi'
import { BiText } from 'react-icons/bi'
import { FormProps } from 'shared/hooks/useApiForm'
import { InputSelect } from 'shared/components/input/InputSelect'

const schema = object().shape({
  name: string().required().default(''),
  description: string().default(''),
  testSelect: string().default('a'),
})

const options = [
  {
    value: 'a',
    label: 'a',
  },
  {
    value: 'b',
    label: 'b',
  },
  {
    value: 'c',
    label: 'oby c',
  },
]

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
    <InputSelect
      icon={FiAlignCenter}
      label="Test"
      name="testSelect"
      options={options}
    />
    {children}
  </UncontrolledForm>
)
