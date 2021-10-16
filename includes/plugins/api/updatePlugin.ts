export const updatePlugin = (id: string) => async (data: any) =>
  fetch(`/api/plugins/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
