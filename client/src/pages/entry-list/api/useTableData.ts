import { useState } from "react"
import { TableEntry } from "../model/table-model"

const dataSource: TableEntry[] = [
  {
    key: "1",
    date: "15.02.2025",
    job: "Кладка перегородок",
    amount: 24,
    unit: "м3",
    worker_name: "Иванов И.И.",
  },
  {
    key: "2",
    date: "15.02.2025",
    job: "Монтаж опалубки",
    amount: 24,
    unit: "м3",
    worker_name: "Иванов И.И.",
  },
]

export function useTableData() {
  const [itemList, setItemList] = useState(dataSource)

  return {
    list: itemList,
    pagination: {
      current: 1,
      total: 50,
    },
  }
}
