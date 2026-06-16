import Flex from "antd/es/flex"
import { ReactNode } from "react"
import { EntryTableEntry } from "../model/schema"
import EditButton from "./edit-button"
import DeleteButton from "./delete-button"

type ItemButtons = (_: unknown, record: EntryTableEntry) => ReactNode

const ItemButtons: ItemButtons = (_, { id }) => (
  <Flex justify="end" gap="small">
    <EditButton id={id} />
    <DeleteButton id={id} />
  </Flex>
)

export default ItemButtons
