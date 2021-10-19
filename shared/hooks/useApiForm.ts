import { SchemaOf } from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import useRequest, { useRequestQuery } from './useRequest'
import { ReactNode } from 'react'

export type FormProps<T> = Omit<useApiFormProps<T>, 'schema'> & {
  children?: ReactNode
}

export type useApiFormProps<T> = {
  schema: SchemaOf<T>
  query: useRequestQuery<(data: T) => Promise<Response>>
  initial?: Partial<T>
  onSuccess?: (...args: any[]) => void
  onError?: (...args: any[]) => void
}

const useApiForm = <T extends Record<string, unknown>>({
  schema,
  initial,
  query,
  onSuccess,
  onError,
}: useApiFormProps<T>) => {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...schema.getDefaultFromShape(),
      ...initial,
    },
  })

  const request = useRequest(query, { onSuccess, onError })

  return { methods, request }
}

export default useApiForm
