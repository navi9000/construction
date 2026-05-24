import { Button, Flex, Table, TableColumnsType, Typography } from "antd"
import { useState, type FC } from "react"
import TableModal from "./table-modal"

interface TableEntry {
  key: string
  job: string
  unit: string
}

const dataSource: TableEntry[] = [
  {
    key: "1",
    job: "Кладка перегородок",
    unit: "м3",
  },
  {
    key: "2",
    job: "Монтаж опалубки",
    unit: "м3",
  },
]

const columns: TableColumnsType<TableEntry> = [
  {
    title: "Вид работ",
    dataIndex: "job",
    key: "job",
  },
  {
    title: "Ед. изм.",
    dataIndex: "unit",
    key: "unit",
  },
  {
    key: "buttons",
    render: (_, record) => (
      <Flex justify="end" gap="small">
        <a>Редактировать</a>
        <a>Удалить</a>
      </Flex>
    ),
  },
]

const JobTypes: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <main>
      <Typography.Title>Список записей</Typography.Title>
      <Flex justify="end">
        <Button onClick={openModal}>Новый вид работ</Button>
      </Flex>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
      <TableModal isOpen={isModalOpen} close={closeModal} />
    </main>
  )
}

export default JobTypes
