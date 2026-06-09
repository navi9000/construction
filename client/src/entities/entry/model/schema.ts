import type { ColumnsType } from "antd/es/table"
import ItemButtons from "../ui/item-buttons"
import { ApiMeta } from "@/shared/api"

export interface UnitServerModel {
  id: number
  name: string
}

export interface JobServerModel {
  id: number
  name: string
  units: UnitServerModel[]
}

export interface EntryServerModel {
  id: number
  date: string
  job: JobServerModel
  unit: UnitServerModel
  worker_name: string
  amount: number
}

export interface EntryTableEntry {
  id: number
  key: string
  date: string
  job: JobServerModel
  jobStringified: string
  amount: number
  unit: UnitServerModel
  unitStringified: string
  worker_name: string
}

export type GetEntriesParams = Partial<{
  page: string
  date: string
  order: string
}>

export interface GetEntriesResponse {
  entryList: EntryTableEntry[]
  meta: ApiMeta
}

export interface CreateEntryParams {
  date: string
  job_id: number
  unit_id: number
  amount: number
  worker_name: string
}

export type UpdateEntryParams = { id: number } & Partial<CreateEntryParams>

export type CreateEntryErrors = Partial<Record<keyof CreateEntryParams, string>>

export interface CreateEntryErrorResponse {
  errors: CreateEntryErrors
}

export const columns: ColumnsType<EntryTableEntry> = [
  {
    title: "Дата",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Вид работ",
    dataIndex: "jobStringified",
    key: "jobStringified",
  },
  {
    title: "Объем работ",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Ед. изм.",
    dataIndex: "unitStringified",
    key: "unitStringified",
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
