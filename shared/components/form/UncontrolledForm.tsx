import useApiForm, { useApiFormProps } from '../../hooks/useApiForm'
import { ComponentProps, ReactNode } from 'react'
import Form from './Form'

interface UncontrolledFormProps<T>
  extends useApiFormProps<T>,
    ComponentProps<'form'> {
  children: ReactNode
}

export const UncontrolledForm = <T extends Record<string, unknown>>({
  schema,
  initial,
  query,
  onSuccess,
  onError,
  children,
  ...props
}: UncontrolledFormProps<T>) => {
  const apiForm = useApiForm({
    schema,
    query,
    initial,
    onSuccess,
    onError,
  })

  return (
    <Form {...apiForm} {...props}>
      {children}
    </Form>
  )
}
