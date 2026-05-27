import {
  Modal,
  Input,
  Form,
  DatePicker,
  Space,
  Select,
  Typography,
  Flex,
} from "antd"
import { ChangeEventHandler, FC, useState } from "react"
import { Dayjs } from "dayjs"
import { useGetJobsQuery } from "@/entities/job"
import { GetJobsResponse } from "@/entities/job/model/schema"
import { useAddEntryMutation } from "@/entities/entry"
import { CreateEntryErrors } from "@/entities/entry/model/schema"

interface TableModalProps {
  isOpen: boolean
  close: () => void
}

interface Option {
  label: string
  value: string
}

const getCreateEntryErrors = (
  error: unknown,
): CreateEntryErrors | undefined => {
  if (!error || typeof error !== "object" || !("errors" in error)) {
    return undefined
  }

  return error.errors as CreateEntryErrors
}

const CreateModal: FC<TableModalProps> = ({ isOpen, close }) => {
  const { data: jobsData } = useGetJobsQuery({})
  const [addEntry, { isLoading, error }] = useAddEntryMutation()

  const [date, setDate] = useState<Dayjs | null>(null)
  const [jobType, setJobType] = useState<string | null>(null)
  const [amount, setAmount] = useState("")
  const [unitList, setUnitList] = useState<Option[]>([])
  const [unitType, setUnitType] = useState<string | null>(null)
  const [workerName, setWorkerName] = useState("")

  const addEntryErrors = getCreateEntryErrors(error)

  const changeAmount: ChangeEventHandler<HTMLInputElement> = (e) => {
    const input = e.target.value
    if (!new RegExp(/^\d*\.?\d{0,}$/).test(input)) {
      return
    }
    setAmount(input)
  }

  const getJobOptions = (input: GetJobsResponse | undefined) => {
    if (!input) {
      return []
    }
    if (!jobsData) {
      return []
    }
    return jobsData.jobList.map((job) => ({
      label: job.name,
      value: job.key,
    }))
  }

  const onChangeJobType = (value: string) => {
    if (!jobsData) {
      return
    }
    const key = value
    const job = jobsData.jobList.find((job) => job.key === key)
    if (!job) {
      return
    }
    const unitList = job.units
    if (!unitList) {
      return
    }
    setJobType(job.key)
    setUnitList(
      unitList.map((unit) => ({ label: unit.name, value: unit.id.toString() })),
    )
  }

  const onSubmit = async () => {
    try {
      const response = await addEntry({
        date: date?.format("YYYY-MM-DD") ?? "",
        unit_id: unitType ? Number(unitType) : -1,
        job_id: jobType ? Number(jobType) : -1,
        worker_name: workerName,
        amount: Number(amount),
      })
      if (!response.error) {
        close()
      }
    } catch {}
  }

  const onCancel = () => {
    close()
  }

  if (!jobsData) {
    return null
  }

  return (
    <Modal
      open={isOpen}
      onOk={onSubmit}
      onCancel={onCancel}
      title="Новая запись"
      okButtonProps={{ loading: isLoading, disabled: isLoading }}
      okText="Создать"
      cancelText="Отмена"
    >
      <Form>
        <Form.Item label="Дата">
          <Flex vertical>
            <DatePicker
              placeholder="Выберите дату"
              value={date}
              onChange={(date) => setDate(date)}
            />
            {addEntryErrors?.date && (
              <Typography.Text type="danger">
                {addEntryErrors.date}
              </Typography.Text>
            )}
          </Flex>
        </Form.Item>
        <Form.Item label="Вид работ">
          <Select
            options={getJobOptions(jobsData)}
            value={jobType}
            onChange={onChangeJobType}
            notFoundContent={<div>Не найдено</div>}
          />
          {addEntryErrors?.job_id && (
            <Typography.Text type="danger">
              {addEntryErrors.job_id}
            </Typography.Text>
          )}
        </Form.Item>
        <Form.Item label="Объем">
          <Space.Compact style={{ width: "100%" }}>
            <Input value={amount} onChange={changeAmount} />
            <Select
              options={unitList}
              value={unitType}
              onChange={setUnitType}
              notFoundContent={<div>Не найдено</div>}
            />
          </Space.Compact>
          <Flex vertical>
            {addEntryErrors?.unit_id && (
              <Typography.Text type="danger">
                {addEntryErrors.unit_id}
              </Typography.Text>
            )}
            {addEntryErrors?.amount && (
              <Typography.Text type="danger">
                {addEntryErrors.amount}
              </Typography.Text>
            )}
          </Flex>
        </Form.Item>
        <Form.Item label="ФИО">
          <Input
            value={workerName}
            onChange={(e) => setWorkerName(e.target.value)}
          />
          {addEntryErrors?.worker_name && (
            <Typography.Text type="danger">
              {addEntryErrors.worker_name}
            </Typography.Text>
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateModal
