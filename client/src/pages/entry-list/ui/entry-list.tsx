import {
  Button,
  DatePicker,
  Flex,
  Table,
  TableColumnsType,
  Typography,
} from "antd"
import type { FC } from "react"

interface TableEntry {
  key: string
  date: string
  job: string
  amount: number
  unit: string
  worker_name: string
}

const dataSource: TableEntry[] = [
  {
    key: "1",
    date: "15.02.2025",
    job: "Кладка перегородок",
    amount: 24,
    unit: "м3",
    worker_name: "Иванов И.И.",
  },
  {
    key: "2",
    date: "15.02.2025",
    job: "Монтаж опалубки",
    amount: 24,
    unit: "м3",
    worker_name: "Иванов И.И.",
  },
]

const columns: TableColumnsType<TableEntry> = [
  {
    title: "Дата",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Вид работ",
    dataIndex: "job",
    key: "job",
  },
  {
    title: "Объем работ",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Ед. изм.",
    dataIndex: "unit",
    key: "unit",
  },
  {
    title: "ФИО",
    dataIndex: "worker_name",
    key: "worker_name",
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

const EntryList: FC = () => {
  return (
    <main>
      <Typography.Title>Список записей</Typography.Title>
      <Flex justify="space-between">
        <DatePicker />
        <Button>Новая запись</Button>
      </Flex>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </main>
  )
}

export default EntryList
