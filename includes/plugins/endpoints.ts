import request from 'shared/utils/request'

export const updatePlugin = (id: string) => (data: any) =>
  request.patch(`/api/plugins/${id}`, data)

export const createPlugin = (data: any) => request.post('/api/plugins', data)

export const deletePlugin = (id: string) => () =>
  request.delete(`/api/plugins/${id}`)

export const updatePluginFile = (id: string) => (file: File) =>
  fetch(`/api/plugins/${id}/file`, {
    method: 'PUT',
    body: file,
  }).then(async (response) => {
    const data = await response.json()
    if (!response.ok) throw new Error(data?.message)
    return data
  })
