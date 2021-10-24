import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import useRequest, {
  useRequestOptionsType,
  useRequestQueryType,
} from './useRequest'
import { AnyObjectSchema, TypeOf } from 'yup'
import { ReactNode } from 'react'

export type FormProps<T extends AnyObjectSchema> = Omit<
  useApiFormProps<T>,
  'schema'
> & {
  children?: ReactNode
}

export type useApiFormProps<T extends AnyObjectSchema> = {
  schema: T
  query: useRequestQueryType
  initial?: Partial<TypeOf<T>>
  onSuccess?: useRequestOptionsType['onSuccess']
  onError?: useRequestOptionsType['onError']
}

const useApiForm = <T extends AnyObjectSchema>({
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
