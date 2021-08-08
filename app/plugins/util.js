// 今日かどうか
const isToday = (someDate) => {
  const today = new Date()
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}
// 昨日かどうか
const isYesterday = (someDate) => {
  const now = new Date()
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
  return someDate.getDate() == yesterday.getDate() &&
    someDate.getMonth() == yesterday.getMonth() &&
    someDate.getFullYear() == yesterday.getFullYear()
}
// 今年かどうか
const isThisYear = (someDate) => {
  const today = new Date()
  return someDate.getFullYear() == today.getFullYear();
}

export default ({}, inject) => {
  inject('isToday', isToday);
  inject('isYesterday', isYesterday);
  inject('isThisYear', isThisYear);
}