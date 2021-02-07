export const scrollToInvalidFirstElement = (form) => {
  for (const item of form.fields) {
    if (item.validateState === 'error' && item.validateMessage) {
      item.$el.scrollIntoViewIfNeeded(true)
      break
    }
  }
}
