const { palindrome } = require('../utils/for_testing')

test('palindrome of charlie', () => {
  const result = palindrome('charlie')

  expect(result).toBe('eilrahc')
})

test('palindrome of empty string', () => {
  const result = palindrome('')

  expect(result).toBe('')
})

test('palindrome of undefined', () => {
  const result = palindrome()

  expect(result).toBeUndefined()
})

test('palindrome is null', () => {
  const result = palindrome(null)

  expect(result).toBeUndefined()
})
