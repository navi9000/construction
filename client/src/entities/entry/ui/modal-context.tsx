import { createContext, use } from "react"

export interface ModalContextValues {
  create?: {
    isOpen: boolean
    open: () => void
    close: () => void
  }
  update: {
    isOpen: boolean
    open: (id: number) => void
    close: () => void
  }
}

export const ModalContext = createContext<ModalContextValues | null>(null)

export function useModalContext() {
  const context = use(ModalContext)

  if (!context) {
    throw new Error("useModalContext must be within ModalContextProvider")
  }

  return context
}
