// immutating
const sortKeys = (hash) => {
  const res = {}
  Object.entries(hash).sort().forEach(([key, value]) => {
    res[key] = value
  })
  return res
}

// immutating
const hashMerger = (existing, addition) => {
  // Create object with all keys, priority to new hash
  // Keys that exist exclusively in existing hash wont be iterated over
  // This is more optimised as the string to be parsed gets longer
  const res = { ...existing, ...addition }
  // Iterate over new keys
  Object.keys(addition).forEach((k) => {
    // If key also exists in existing, sum the key values
    if (existing[k]) {
      res[k] += existing[k]
    }
  })
  return res
}

// immutating
const hashMultiplier = (hash, multiplier) => {
  const res = {}
  Object.keys(hash).forEach((k) => {
    res[k] = hash[k] * multiplier
  })
  return res
}

// immutating
const stackConverter = (stack) => {
  let res = {}
  let iter = stack.length
  let multiplier = 1
  while (--iter >= 0) {
    value = stack[iter]
    switch(typeof value) {
      case 'string':
        if (res[value] === undefined) {
          res[value] = multiplier
        } else {
          res[value] += multiplier
        }
        multiplier = 1
        break
      case 'number':
        multiplier = value
        break
      case 'object':
        res = hashMerger(res, hashMultiplier(value, multiplier))
        multiplier = 1
        break
      default:
        console.log('Unexpected type in stackConverter', typeof value, value)
        throw 'Unexpected type in stackConverter'
    }
  }
  return res
}

const bracketConverter = { '[': ']', '{': '}', '(': ')' }

// immutating
const recursiveLookup = (oldStack, chars, iter, bracket = null) => {
  const char = chars[iter]
  // For immutability
  const stack = [...oldStack]
  // Only slightly better than a forest, but a lexicon doesn't suit my needs
  switch(char) {
    case undefined:
    case ']':
    case '}':
    case ')':
      // This recursion is at its end, compute and callback
      if (char === bracketConverter[bracket]) {
        return [stackConverter(stack), iter]
      } else {
        // console.log('Incorrectly nested brackets', char, bracketConverter[bracket])
        throw 'Incorrectly nested brackets'
      }
    case '[':
    case '{':
    case '(':
      // Recurse over compound
      const innerLookup = recursiveLookup([], chars, iter + 1, char)
      // Add inner hash to stack
      stack[stack.length] = innerLookup[0]
      // Shift iterator to after compound
      iter = innerLookup[1]
      break
    default:
      const stackLast = stack[stack.length - 1]
      if (isNaN(char)) {
        // Going to assume it's a character
        if (typeof stackLast === 'string' && char === char.toLowerCase()) {
          // Add characters together if lowercase
          stack[stack.length - 1] = stackLast + char
        } else {
          // Otherwise it's a new element
          stack[stack.length] = char
        }
      } else {
        // Its definitely a number
        if (typeof stackLast === 'number') {
          // "Add" digits together
          stack[stack.length - 1] = stackLast * 10 + parseInt(char)
        } else {
          stack[stack.length] = parseInt(char)
        }
      }
  }
  return recursiveLookup(stack, chars, iter + 1, bracket)
}

const modecularParser = (moleculeString) => {
  if (!typeof moleculeString === 'string') {
    throw 'Modecular parser requires a string'
  }
  console.log('Input string:', moleculeString)
  // Create character array
  const chars = moleculeString.split('')
  // Send back only count, user doesn't care about the iterator
  const res = recursiveLookup([], chars, 0)[0]
  // Sort the keys for a nice looking result
  // There is probably a better way to do this but I don't have time right now
  return sortKeys(res)
}

module.exports = modecularParser
