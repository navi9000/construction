import { Button, DatePicker, Flex, Table, Typography } from "antd"
import ru from "antd/es/date-picker/locale/ru_RU"
import CreateModal from "./create-modal"
import {
  ModalContextProvider,
  useCreateModal,
  useUpdateModal,
} from "@/widgets/modal"
import { useTableData } from "../api/use-table-data"
import { columns } from "@/entities/entry"
import UpdateModal from "./update-modal"
import dayjs from "dayjs"
import type { FC } from "react"

const EntryList: FC = () => {
  const {
    data,
    pagination,
    isError,
    isLoading,
    date,
    setDate,
    setOrder,
    sortButtonLabel,
  } = useTableData()

  const [isCreateModalOpen, openCreateModal, closeCreateModal] =
    useCreateModal()
  const { isUpdateModalOpen, openUpdateModal, closeUpdateModal, selectedItem } =
    useUpdateModal(data?.entryList)

  return (
    <ModalContextProvider open={openUpdateModal}>
      <main>
        <Typography.Title>Список записей</Typography.Title>
        <Flex justify="space-between">
          <Flex gap="small">
            <DatePicker
              locale={ru}
              value={date ? dayjs(date) : null}
              onChange={setDate}
            />
            <Button onClick={setOrder}>{sortButtonLabel}</Button>
          </Flex>
          <Button onClick={openCreateModal}>Новая запись</Button>
        </Flex>
        <br />
        {isLoading && <Typography.Text>Загрузка...</Typography.Text>}
        {isError && <Typography.Text>Ошибка</Typography.Text>}
        {!isLoading && !isError && (
          <>
            <Table
              dataSource={data?.entryList}
              columns={columns}
              pagination={pagination}
            />
            <CreateModal isOpen={isCreateModalOpen} close={closeCreateModal} />
            <UpdateModal
              isOpen={isUpdateModalOpen}
              close={closeUpdateModal}
              entry={selectedItem}
            />
          </>
        )}
      </main>
    </ModalContextProvider>
  )
}

export default EntryList
