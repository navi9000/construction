import { useState } from "react"

export function useUpdateModal<T extends { id: number }>(list?: T[]) {
  const [selectedItem, setSelectedItem] = useState<T | null>(null)

  const openUpdateModal = (id: number) => {
    setSelectedItem(getSelectedItem(id))
  }

  const closeUpdateModal = () => {
    setSelectedItem(null)
  }

  const isUpdateModalOpen = selectedItem !== null

  const getSelectedItem = (id: number) => {
    return list?.find((item) => item.id === id) ?? null
  }

  return {
    selectedItem,
    openUpdateModal,
    closeUpdateModal,
    isUpdateModalOpen,
  }
}
