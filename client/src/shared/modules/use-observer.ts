import { useEffect } from "react"
import observer from "./observer"

export function useObserver(callback: Function) {
  useEffect(() => {
    observer.add(callback)

    return () => {
      observer.remove(callback)
    }
  }, [callback])
}
