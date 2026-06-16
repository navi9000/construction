import { use } from "react"
import { ModalContext } from "../model/modal-context"

export function useModalContext() {
  const context = use(ModalContext)

  if (!context) {
    throw new Error("useModalContext must be within ModalContextProvider")
  }

  return context
}
