import { useForm, UseFormReturn } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import useRequest, { useRequestErrorType, useRequestQueryType } from './useRequest'
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
  onSuccess?: <T>(data: T, methods: UseFormReturn) => void
  onError?: (error: useRequestErrorType, methods: UseFormReturn) => void
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

  const request = useRequest(query, {
    onSuccess: (data) => onSuccess?.(data, methods),
    onError: (error) => onError?.(error, methods),
  })

  return { methods, request }
}

export default useApiForm
