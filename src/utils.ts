export const clipboardCopy = (data) => {
  return navigator && navigator.clipboard && navigator.clipboard.writeText(data)
}