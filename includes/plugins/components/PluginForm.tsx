import useApiForm, { FormProps } from '../../../hooks/useApiForm'
import { InputText } from '../../../components/form/InputText'
import { object, string, TypeOf } from 'yup'
import Form from '../../../components/form/Form'

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
}: FormProps<TypeOf<typeof schema>>) => {
  const { methods, handleSubmit, request } = useApiForm({
    schema,
    query,
    initial,
    onSuccess,
    onError,
  })

  return (
    <Form {...{ methods, handleSubmit }}>
      <InputText name="name" label="Name" />
      <InputText name="description" label="Description" />
      <button type="submit">Submit</button>
      {request.status}
      {children}
    </Form>
  )
}
