import { FormProvider, useForm } from 'react-hook-form'
import { ReactNode } from 'react'
import useApiForm from '../../hooks/useApiForm'

interface FormProps {
  methods: ReturnType<typeof useForm>
  handleSubmit: ReturnType<typeof useApiForm>['handleSubmit']
  children: ReactNode
}

const Form = ({ methods, handleSubmit, children }: FormProps) => (
  <FormProvider {...methods}>
    <form onSubmit={handleSubmit}>{children}</form>
  </FormProvider>
)

export default Form
