const sendFactory =
  (method: string) =>
  (
    url: string,
    body: BodyInit | null | undefined,
    { headers, ...options }: Omit<Omit<RequestInit, 'body'>, 'method'> = {},
  ) =>
    fetch(url, {
      method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...options,
    }).then(async (response) => {
      const data = await response.json()
      if (!response.ok) throw new Error(data?.message)
      return data
    })

const request = {
  post: sendFactory('POST'),
  put: sendFactory('PUT'),
  patch: sendFactory('PATCH'),
}

export default request
