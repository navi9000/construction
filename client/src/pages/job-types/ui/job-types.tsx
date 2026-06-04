import { Button, Flex, Table, Typography } from "antd"
import type { FC } from "react"
import CreateModal from "./create-modal"
import { useCreateModal, useUpdateModal } from "@/widgets/modal"
import { useTableData } from "../api/use-table-data"
import { columns, JobTableEntry, ModalContextProvider } from "@/entities/job"
import UpdateModal from "./update-modal"

const emptyJob: JobTableEntry = {
  id: -1,
  key: "",
  name: "",
  units: [],
  unitsStringified: "",
}

const JobTypes: FC = () => {
  const { data, isLoading, isError } = useTableData()

  const [isCreateModalOpen, openCreateModal, closeCreateModal] =
    useCreateModal()
  const { isUpdateModalOpen, openUpdateModal, closeUpdateModal, selectedItem } =
    useUpdateModal(data?.jobList)

  return (
    <ModalContextProvider
      update={{
        isOpen: isUpdateModalOpen,
        open: openUpdateModal,
        close: closeUpdateModal,
      }}
    >
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
              job={selectedItem ?? emptyJob}
            />
          </>
        )}
      </main>
    </ModalContextProvider>
  )
}

export default JobTypes
