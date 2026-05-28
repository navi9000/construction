import { Button, Flex, Table, Typography } from "antd"
import { useState, type FC } from "react"
import CreateModal from "./create-modal"
import { useModal } from "@/widgets/modal"
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
  const [isCreateModalOpen, openCreateModal, closeCreateModal] = useModal()
  const { data, isLoading, isError } = useTableData()

  const [selectedId, setSelectedId] = useState<number | null>(null)

  const openUpdateModal = (id: number) => {
    setSelectedId(id)
  }

  const closeUpdateModal = () => {
    setSelectedId(null)
  }

  const isUpdateModalOpen = selectedId !== null

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
            {isUpdateModalOpen && (
              <UpdateModal
                isOpen={selectedId !== null}
                close={closeUpdateModal}
                job={
                  data?.jobList.find((item) => item.id === selectedId) ??
                  emptyJob
                }
              />
            )}
          </>
        )}
      </main>
    </ModalContextProvider>
  )
}

export default JobTypes
