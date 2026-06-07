import { Button, Flex, Table, Typography } from "antd"
import type { FC } from "react"
import CreateModal from "./create-modal"
import {
  ModalContextProvider,
  useCreateModal,
  useUpdateModal,
} from "@/widgets/modal"
import { useTableData } from "../api/use-table-data"
import { columns } from "@/entities/job"
import UpdateModal from "./update-modal"

const JobTypes: FC = () => {
  const { data, isLoading, isError } = useTableData()

  const [isCreateModalOpen, openCreateModal, closeCreateModal] =
    useCreateModal()
  const { isUpdateModalOpen, openUpdateModal, closeUpdateModal, selectedItem } =
    useUpdateModal(data?.jobList)

  return (
    <ModalContextProvider open={openUpdateModal}>
      <main>
        <Typography.Title>Виды работ</Typography.Title>
        <Flex justify="end">
          <Button onClick={openCreateModal}>Новый вид работ</Button>
        </Flex>
        <br />
        {isLoading && <Typography.Text>Загрузка...</Typography.Text>}
        {isError && <Typography.Text>Ошибка</Typography.Text>}
        {!isLoading && !isError && (
          <>
            <Table
              dataSource={data?.jobList}
              columns={columns}
              pagination={false}
            />
            <CreateModal isOpen={isCreateModalOpen} close={closeCreateModal} />
            <UpdateModal
              isOpen={isUpdateModalOpen}
              close={closeUpdateModal}
              job={selectedItem}
            />
          </>
        )}
      </main>
    </ModalContextProvider>
  )
}

export default JobTypes
