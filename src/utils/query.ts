export const getQueryObj: () => any = () => {
  const search = window.location.search.substring(1)
  const arr = search.split('&').filter(Boolean)

  return arr.reduce((obj, str) => {
    const [_key, _value] = str.split('=')

    return {
      ...obj,
      [_key]: _value
    }
  }, {})
}