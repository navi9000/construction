import { useState } from "react"

export function useCreateModal() {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return [isOpen, openModal, closeModal] as const
}
