/**
 *
 * @param {String} timeString The time string the api returns 🤦
 *
 * @returns {Number} timeInMinutes The time in minutes
 */
export default function getTimeInMinutesFromString (timeString) {
  const numberPattern = /\d+/g
  const isInMinutes = timeString.indexOf('minute') > 0
  const timeInMinutes = isInMinutes ? timeString.match(numberPattern) : timeString.match(numberPattern) * 60

  return timeInMinutes
}
