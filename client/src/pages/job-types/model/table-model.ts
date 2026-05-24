import { TableColumnsType } from "antd"
import ItemButtons from "../ui/item-buttons"

export interface TableEntry {
  key: string
  job: string
  unit: string
}

export const columns: TableColumnsType<TableEntry> = [
  {
    title: "Вид работ",
    dataIndex: "job",
    key: "job",
  },
  {
    title: "Ед. изм.",
    dataIndex: "unit",
    key: "unit",
  },
  {
    key: "buttons",
    render: ItemButtons,
  },
]
