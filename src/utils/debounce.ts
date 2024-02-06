let debounceTimeoutId = 0

export const debounce = (fn: () => void, debounceTime: number) => {
  if (debounceTimeoutId) {
    window.clearTimeout(debounceTimeoutId)
  }

  debounceTimeoutId = window.setTimeout(fn, debounceTime)
}
