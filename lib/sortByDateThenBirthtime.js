module.exports = exports = function sortByDateThenBirthtime(a, b) {
  if (a.date < b.date) {
    return 1
  }
  if (a.date > b.date) {
    return -1
  }
  if (a.stats.birthtime < b.stats.birthtime) {
    return 1
  }
  if (a.stats.birthtime > b.stats.birthtime) {
    return -1
  }
  return 0
}
