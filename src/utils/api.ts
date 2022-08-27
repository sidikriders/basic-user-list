export const fetchAPI = async (url: string, options?: {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  payload?: any;
}) => {
  let finalUrl = url
  const method = options?.method || 'GET'
  if (method === 'GET' && options?.payload) {
    finalUrl = Object.keys(options.payload).reduce((str, key, idx) => {
      if (!options.payload[key]) {
        return str
      }

      return str + (!!idx ? '&' : '') + key + '=' + (options.payload[key] || '')
    }, `${url}?`)
  }

  const resp = await fetch(finalUrl)

  if (resp.ok) {
    return resp.json()
  }

  const obj = await resp.json()

  throw new Error(obj.error || "Something went wrong");
}