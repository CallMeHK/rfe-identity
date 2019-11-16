class Chainable {
  constructor(value, path) {
    this.value = value
    this.path = path
  }

  static of(value, path) {
    return new Chainable(value, path)
  }

  static left(value) {
    return Chainable.of(value, 'left')
  }

  static right(value) {
    return Chainable.of(value, 'right')
  }

  static ok(value) {
    return Chainable.of(value, 'ok')
  }

  static error(value) {
    return Chainable.of(value, 'error')
  }

  static nothing() {
    return Chainable.of(undefined, 'nothing')
  }

  chain(fn) {
    if (this.path === 'error' || this.path === 'nothing') {
      return this
    }

    const runFn = fn(this.value)
    this.value = runFn.value
    this.path = runFn.path
    return this
  }

  match(matcher) {
    return matcher[this.path](this)
  }

  chainP(fn) {
    return fn(this.value).then(promised => {
      this.value = promised.value
      this.path = promised.path
      return this
    })
  }

  willMatch(matcher) {
    return this.then(promised => {
      this.value = promised.value
      this.path = promised.path
      return this.match(matcher)
    })
  }
}


module.exports = Chainable