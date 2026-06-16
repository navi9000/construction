import { createContext } from "react"

export interface ModalContextValues {
  open: (id: number) => void
}

export const ModalContext = createContext<ModalContextValues | null>(null)
