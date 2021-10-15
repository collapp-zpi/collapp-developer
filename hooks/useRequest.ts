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
) => Promise<ReturnType<T>>

export type useRequestOptions = {
  onSuccess?: (...args: any[]) => void
  onError?: (...args: any[]) => void
}

const useRequest = <T extends AnyFunction>(
  query: useRequestQuery<T>,
  { onSuccess, onError }: useRequestOptions = {},
) => {
  const [status, setStatus] = useState(RequestState.Pending)

  const send = (...args: Parameters<T>) => {
    setStatus(RequestState.Loading)

    query(...args)
      .then((...data) => {
        setStatus(RequestState.Success)

        if (onSuccess) onSuccess(...data)
      })

      .catch((...data) => {
        setStatus(RequestState.Error)

        if (onError) onError(...data)
      })
  }

  return { send, status }
}

export default useRequest
