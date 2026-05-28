import { TableColumnsType } from "antd"
import ItemButtons from "../ui/item-buttons"

export interface UnitServerModel {
  id: number
  name: string
}

export interface JobServerModel {
  id: number
  name: string
  units: UnitServerModel[]
}

export interface JobTableEntry {
  id: number
  key: string
  name: string
  units: UnitServerModel[]
  unitsStringified: string
}

export interface GetJobsResponse {
  jobList: JobTableEntry[]
}

export interface CreateJobParams {
  name: string
  unit_ids: number[]
}

export type UpdateJobParams = { id: number } & Partial<CreateJobParams>

export type CreateJobErrors = Partial<Record<keyof CreateJobParams, string>>

export interface CreateJobErrorResponse {
  errors: CreateJobErrors
}

export const columns: TableColumnsType<JobTableEntry> = [
  {
    title: "Вид работ",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Ед. изм.",
    dataIndex: "unitsStringified",
    key: "unitsStringified",
  },
  {
    key: "buttons",
    render: ItemButtons,
  },
]
