import { TableColumnsType } from "antd"
import ItemButtons from "../ui/item-buttons"

export interface TableEntry {
  key: string
  date: string
  job: string
  amount: number
  unit: string
  worker_name: string
}

export const columns: TableColumnsType<TableEntry> = [
  {
    title: "Дата",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Вид работ",
    dataIndex: "job",
    key: "job",
  },
  {
    title: "Объем работ",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Ед. изм.",
    dataIndex: "unit",
    key: "unit",
  },
  {
    title: "ФИО",
    dataIndex: "worker_name",
    key: "worker_name",
  },
  {
    key: "buttons",
    render: ItemButtons,
  },
]
