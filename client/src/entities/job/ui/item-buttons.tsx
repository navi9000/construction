import Flex from "antd/es/flex"
import { ReactNode } from "react"
import { JobTableEntry } from "../model/schema"
import EditButton from "./edit-button"

type ItemButtons = (_: unknown, record: JobTableEntry) => ReactNode

const ItemButtons: ItemButtons = (_, record) => {
  return (
    <Flex justify="end" gap="small">
      <EditButton id={record.id} />
    </Flex>
  )
}

export default ItemButtons
