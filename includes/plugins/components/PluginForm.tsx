import useApiForm from '../../../hooks/useApiForm'
import { createPlugin } from '../api/createPlugin'
import { FormProvider } from 'react-hook-form'
import { InputText } from '../../../components/form/InputText'
import { object, string } from 'yup'

const schema = object().shape({
  name: string().required(),
  description: string(),
})

export const PluginForm = () => {
  const { methods, handleSubmit, request } = useApiForm({
    schema,
    query: createPlugin,
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        <InputText name="name" label="Name" />
        <InputText name="description" label="Description" />
        <button type="submit">Submit</button>
        {request.status}
      </form>
    </FormProvider>
  )
}
