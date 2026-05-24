import { Button, Flex, Table, Typography } from "antd"
import { type FC } from "react"
import TableModal from "./table-modal"
import { useModal } from "@/widgets/modal"
import { useTableData } from "../api/use-table-data"
import { columns } from "../model/table-model"

const JobTypes: FC = () => {
  const [isOpen, openModal, closeModal] = useModal()
  const { list, pagination } = useTableData()

  return (
    <main>
      <Typography.Title>Список записей</Typography.Title>
      <Flex justify="end">
        <Button onClick={openModal}>Новый вид работ</Button>
      </Flex>
      <Table dataSource={list} columns={columns} pagination={pagination} />
      <TableModal isOpen={isOpen} close={closeModal} />
    </main>
  )
}

export default JobTypes
