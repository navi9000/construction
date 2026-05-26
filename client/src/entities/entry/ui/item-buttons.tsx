import { Flex } from "antd"
import { ReactNode } from "react"
import { TableEntry } from "../model/schema"

type ItemButtons = (_: any, record: TableEntry) => ReactNode

const ItemButtons: ItemButtons = (_, record) => (
  <Flex justify="end" gap="small">
    <a>Редактировать</a>
    <a>Удалить</a>
  </Flex>
)

export default ItemButtons
