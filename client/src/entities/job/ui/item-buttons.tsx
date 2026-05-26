import { Flex } from "antd"
import { ReactNode } from "react"
import { JobTableEntry } from "../model/schema"

type ItemButtons = (_: any, record: JobTableEntry) => ReactNode

const ItemButtons: ItemButtons = (_, record) => (
  <Flex justify="end" gap="small">
    <a>Редактировать</a>
    <a>Удалить</a>
  </Flex>
)

export default ItemButtons
