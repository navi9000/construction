import { Button, DatePicker, Flex, Table, Typography } from "antd"
import ru from "antd/es/date-picker/locale/ru_RU"
import { useState, type FC } from "react"
import CreateModal from "./create-modal"
import { useModal } from "@/widgets/modal"
import { useTableData } from "../api/use-table-data"
import {
  columns,
  EntryTableEntry,
  ModalContextProvider,
} from "@/entities/entry"
import UpdateModal from "./update-modal"
import dayjs from "dayjs"

const emptyEntry: EntryTableEntry = {
  id: -1,
  key: "",
  date: "",
  job: {
    id: -1,
    name: "",
    units: [],
  },
  jobStringified: "",
  amount: 0,
  unit: {
    id: -1,
    name: "",
  },
  unitStringified: "",
  worker_name: "",
}

const EntryList: FC = () => {
  const [isCreateModalOpen, openCreateModal, closeCreateModal] = useModal()
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
            {isUpdateModalOpen && (
              <UpdateModal
                isOpen={selectedId !== null}
                close={closeUpdateModal}
                entry={
                  data?.entryList.find((item) => item.id === selectedId) ??
                  emptyEntry
                }
              />
            )}
          </>
        )}
      </main>
    </ModalContextProvider>
  )
}

export default EntryList
