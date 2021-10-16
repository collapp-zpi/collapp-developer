import { useState } from 'react'

export enum RequestState {
  Pending = 'Pending',
  Loading = 'Loading',
  Error = 'Error',
  Success = 'Success',
}

export type AnyFunction = (...args: any[]) => any

export type useRequestQuery<T extends AnyFunction> = (
  ...args: Parameters<T>
) => ReturnType<T>

export type useRequestOptions = {
  onSuccess?: (args: any) => void
  onError?: (args: any) => void
}

const useRequest = <T extends AnyFunction>(
  query: useRequestQuery<T>,
  { onSuccess, onError }: useRequestOptions = {},
) => {
  const [status, setStatus] = useState(RequestState.Pending)

  const send = async (...args: Parameters<T>) => {
    setStatus(RequestState.Loading)

    try {
      const response = await query(...args)
      if (!response.ok) throw new Error(response)
      setStatus(RequestState.Success)

      if (onSuccess) onSuccess(response)
    } catch (e) {
      setStatus(RequestState.Error)

      if (onError) onError(e)
    }
  }

  return { send, status }
}

export default useRequest
