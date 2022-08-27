export const fetchAPI = async (url: string, options?: {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  payload?: any;
}) => {
  let finalUrl = url
  const method = options?.method || 'GET'
  if (method === 'GET' && options?.payload) {
    finalUrl = url + Object.keys(options.payload).reduce((str, key, idx) => {
      return str + (!!idx ? '&' : '') + key + '=' + (options.payload[key] || '')
    }, '?')
  }

  const resp = await fetch(finalUrl)

  if (resp.ok) {
    return resp.json()
  }

  const obj = await resp.json()

  throw new Error(obj.error || "Something went wrong");
}