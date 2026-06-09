class Observer {
  #savedCallbacks

  constructor(list: Function[] = []) {
    this.#savedCallbacks = list
  }

  add(callback: Function) {
    this.#savedCallbacks = [...this.#savedCallbacks, callback]
  }

  remove(callback: Function) {
    this.#savedCallbacks = this.#savedCallbacks.filter(
      (item) => item !== callback,
    )
  }

  notify(params: Record<string, unknown>) {
    this.#savedCallbacks.forEach((callback) => callback(params))
  }
}

export default new Observer()
