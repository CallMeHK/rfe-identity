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

  chainP(fn) {
    if (this.path === 'error' || this.path === 'nothing') {
      return task(Promise.resolve(Chainable.of(this.value, this.path)))
    }
    return task(fn(this.value))
  }

  match(matcher) {
    return matcher[this.path](this)
  }

  getOk() {
    return this.path === 'ok' ? this.value : null
  }
  getLeft() {
    return this.path === 'left' ? this.value : null
  }
  getRight() {
    return this.path === 'right' ? this.value : null
  }
  getError() {
    return this.path === 'error' ? this.value : null
  }
  getNothing() {
    return this.path === 'nothing' ? true : null
  }
}

const dataStore = new WeakMap()

class AsyncAF {
  constructor(data) {
    dataStore.set(this, Promise.resolve(data))
  }
  static of(data) {
    return new AsyncAF(data)
  }
  then(resolve, reject) {
    return new AsyncAF(dataStore.get(this).then(resolve, reject))
  }
  chain(fn) {
    return this.then(result => {
      if (result.path === 'error' || result.path === 'nothing') {
        return Chainable.of(result.value, result.path)
      }
      return result.chain(fn)
    })
  }

  chainP(fn) {
    return this.then(result => {
      return result.chainP(fn)
    })
  }

  willMatch(matcher) {
    return this.then(result => result.match(matcher)).catch(e =>
      e.match(matcher),
    )
  }
  catch(reject) {
    return this.then(null, reject)
  }
  finally(onFinally) {
    return dataStore.get(this).finally(onFinally)
  }
}

const task = AsyncAF.of

module.exports = {Chainable, AsyncAF, task}
