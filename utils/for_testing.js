const palindrome = (string) => {
  if (typeof string !== 'undefined' && string !== null) {
    return string.split('').reverse().join('')
  }
  return undefined
}

const average = (array) => {
  console.log(typeof array)
  if (array.length === 0) return 0
  let sum = 0
  array.forEach((number) => {
    sum += number
  })
  return sum / array.length
}

module.exports = {
  palindrome,
  average
}
