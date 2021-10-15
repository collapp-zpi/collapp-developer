import { SchemaOf } from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import useRequest, { useRequestQuery } from './useRequest'

export type useApiFormProps<T> = {
  schema: SchemaOf<T>
  initial: Partial<T>
  query: useRequestQuery<(data: T) => T>
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
  const handleSubmit = methods.handleSubmit(request.send)

  return { methods, handleSubmit, request }
}

export default useApiForm
