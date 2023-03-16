
const getFileName = (name) => {
  const path = require('path');
  const filename = path.basename(name);
  return path.parse(filename).name
}

const addIterator = (param) => {
  param[Symbol.iterator] = function* () {
    const root = this.valueOf()
    if (root === null) return
    const stack = [root] //栈，先进后出
    while (stack.length) {
      const item = stack.pop()
      yield item
      const { expression } = item || {}
      if (expression) {
        const { expression: { left, right } = {} } = item || {}
        if (right) stack.push(right)
        if (left) stack.push(left)
      } else {
        const { left, right } = item || {}
        if (right) stack.push(right)
        if (left) stack.push(left)
      }
    }
  }
  return param
}

module.exports = {
  getFileName,
  addIterator
}