import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import useRequest, {
  useRequestOptionsType,
  useRequestQueryType,
} from './useRequest'
import { SchemaOf } from 'yup'
import { ReactNode } from 'react'

export type FormProps<T, S> = Omit<useApiFormProps<T, S>, 'schema'> & {
  children?: ReactNode
}

export type useApiFormProps<T, S> = {
  schema: SchemaOf<S>
  query: T
  initial?: S
  onSuccess?: useRequestOptionsType['onSuccess']
  onError?: useRequestOptionsType['onError']
}

const useApiForm = <
  T extends useRequestQueryType,
  S extends Record<string, any>,
>({
  schema,
  initial,
  query,
  onSuccess,
  onError,
}: useApiFormProps<T, S>) => {
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
