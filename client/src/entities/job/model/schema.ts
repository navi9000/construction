import { TableColumnsType } from "antd"
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

export interface JobTableEntry {
  key: string
  name: string
  units: UnitServerModel[]
  unitsStringified: string
}

export interface GetJobsResponse {
  jobList: JobTableEntry[]
  meta: ApiMeta
}

export interface CreateJobParams {
  name: string
  unit_ids: number[]
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
