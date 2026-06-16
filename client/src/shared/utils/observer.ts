import { useEffect } from "react"

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

const observer = new Observer()

export function useObserver(callback: Function) {
  useEffect(() => {
    observer.add(callback)

    return () => {
      observer.remove(callback)
    }
  }, [callback])
}

export default observer
