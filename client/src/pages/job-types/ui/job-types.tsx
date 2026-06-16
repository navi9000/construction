import Button from "antd/es/button"
import Flex from "antd/es/flex"
import Table from "antd/es/table"
import Typography from "antd/es/typography"
import { type FC } from "react"
import {
  ModalContextProvider,
  useCreateModal,
  useUpdateModal,
} from "@/widgets/modal"
import { columns } from "@/entities/job"
import CreateModal from "./create-modal"
import UpdateModal from "./update-modal"
import { useJobs } from "../api/use-jobs"

const JobTypes: FC = () => {
  const { jobList, isLoading, isError } = useJobs()
  const [isCreateModalOpen, openCreateModal, closeCreateModal] =
    useCreateModal()
  const { isUpdateModalOpen, openUpdateModal, closeUpdateModal, selectedItem } =
    useUpdateModal(jobList)

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
            <Table dataSource={jobList} columns={columns} pagination={false} />
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
