import { Button, DatePicker, Flex, Table, Typography } from "antd"
import ru from "antd/es/date-picker/locale/ru_RU"
import { type FC } from "react"
import CreateTableModal from "./create-table-modal"
import { useModal } from "@/widgets/modal"
import { useTableData } from "../api/use-table-data"
import { columns } from "@/entities/entry"

const EntryList: FC = () => {
  const [isOpen, openModal, closeModal] = useModal()
  const { data, pagination, isError, isLoading } = useTableData()

  return (
    <main>
      <Typography.Title>Список записей</Typography.Title>
      <Flex justify="space-between">
        <DatePicker locale={ru} />
        <Button onClick={openModal}>Новая запись</Button>
      </Flex>
      {isLoading && <Typography.Text>Загрузка...</Typography.Text>}
      {isError && <Typography.Text>Ошибка</Typography.Text>}
      {!isLoading && !isError && (
        <>
          <Table
            dataSource={data?.entryList}
            columns={columns}
            pagination={pagination}
          />
          <CreateTableModal isOpen={isOpen} close={closeModal} />
        </>
      )}
    </main>
  )
}

export default EntryList
