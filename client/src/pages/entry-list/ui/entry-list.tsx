import { Button, DatePicker, Flex, Table, Typography } from "antd"
import ru from "antd/es/date-picker/locale/ru_RU"
import { type FC } from "react"
import TableModal from "./table-modal"
import { useModal } from "@/widgets/modal"
import { columns } from "../model/table-model"
import { useTableData } from "../api/useTableData"

const EntryList: FC = () => {
  const [isOpen, openModal, closeModal] = useModal()
  const { list, pagination } = useTableData()

  return (
    <main>
      <Typography.Title>Список записей</Typography.Title>
      <Flex justify="space-between">
        <DatePicker locale={ru} />
        <Button onClick={openModal}>Новая запись</Button>
      </Flex>
      <Table dataSource={list} columns={columns} pagination={pagination} />
      <TableModal isOpen={isOpen} close={closeModal} />
    </main>
  )
}

export default EntryList
