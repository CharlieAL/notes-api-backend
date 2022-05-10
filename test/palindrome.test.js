const { palindrome } = require('../utils/for_testing')

test.skip('palindrome of charlie', () => {
  const result = palindrome('charlie')

  expect(result).toBe('eilrahc')
})

test.skip('palindrome of empty string', () => {
  const result = palindrome('')

  expect(result).toBe('')
})

test.skip('palindrome of undefined', () => {
  const result = palindrome()

  expect(result).toBeUndefined()
})

test.skip('palindrome is null', () => {
  const result = palindrome(null)

  expect(result).toBeUndefined()
})
