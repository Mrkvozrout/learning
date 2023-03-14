
const dateFormatOptions = {
  weekday: 'long',
  day: 'numeric',
  month: 'long'
}


exports.getDate = (date) => {
  if (!date) {
    date = new Date()
  }
  return date.toLocaleDateString('en-GB', dateFormatOptions)
}
