import { ComponentProps, ReactNode } from 'react'
import Form from './Form'
import useApiForm, { useApiFormProps } from '../../hooks/useApiForm'
import { useRequestQueryType } from '../../hooks/useRequest'

interface UncontrolledFormProps<T, S>
  extends Omit<ComponentProps<'form'>, 'onError'>,
    useApiFormProps<T, S> {
  children: ReactNode
}

export const UncontrolledForm = <
  T extends useRequestQueryType,
  S extends Record<string, any>,
>({
  schema,
  initial,
  query,
  onSuccess,
  onError,
  children,
  ...props
}: UncontrolledFormProps<T, S>) => {
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
