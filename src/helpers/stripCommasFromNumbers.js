/**
 *
 * @param {String} a number which has been stringified and commafied ("1,000,000")
 *
 * @return {Number} a plain old number yo
 */
const stripCommasFromNumbers = str => parseInt(str.replace(/,/g, ''), 10)

export default stripCommasFromNumbers
