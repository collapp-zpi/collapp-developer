import request from 'shared/utils/request'

export const updatePlugin = (id: string) => (data: any) =>
  request.patch(`/api/plugins/${id}`, data)

export const createPlugin = (data: any) => request.post('/api/plugins', data)

export const deletePlugin = (id: string) => () =>
  request.delete(`/api/plugins/${id}`)

export const submitPlugin = (id: string) => () =>
  request.post(`/api/plugins/${id}/submit`)

export const updatePluginFile = (id: string) => (file: File) => {
  const body = new FormData()
  body.append('file', file)

  return fetch(`/api/plugins/${id}/file`, {
    method: 'POST',
    body,
  }).then(async (response) => {
    const data = await response.json()
    if (!response.ok) throw new Error(data?.message)
    return data
  })
}
