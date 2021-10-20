export const createPlugin = async (data: any) =>
  fetch(`/api/plugins`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((data) => data.json())
