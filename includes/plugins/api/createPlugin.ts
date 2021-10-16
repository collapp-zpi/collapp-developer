export const createPlugin = async (data: any) =>
  fetch(`/api/plugins`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
