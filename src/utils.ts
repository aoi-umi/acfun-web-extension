export const clipboardCopy = (data) => {
  return navigator && navigator.clipboard && navigator.clipboard.writeText(data)
}

export const wait = (ms) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms);
  })
}

export const insert = (opt: { input: HTMLInputElement | HTMLTextAreaElement, rangeIndex, text }) => {
  let { input, rangeIndex, text } = opt
  if (rangeIndex) {
    let oldVaue = input.value;
    input.value = oldVaue.slice(0, rangeIndex) + text + oldVaue.slice(rangeIndex);
    rangeIndex = rangeIndex + text.toString().length;
  } else {
    input.value += text;
    rangeIndex = input.value.length;
  }
  input.focus();
  input.setSelectionRange(rangeIndex, rangeIndex)
}