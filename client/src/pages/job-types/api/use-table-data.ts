import { useState } from "react"
import { TableEntry } from "../model/table-model"

const dataSource: TableEntry[] = [
  {
    key: "1",
    job: "Кладка перегородок",
    unit: "м3",
  },
  {
    key: "2",
    job: "Монтаж опалубки",
    unit: "м3",
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
