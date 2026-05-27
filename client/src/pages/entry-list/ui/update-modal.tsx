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
import { ChangeEventHandler, FC, useEffect, useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import { useGetJobsQuery } from "@/entities/job"
import { GetJobsResponse } from "@/entities/job/model/schema"
import {
  useAddEntryMutation,
  useUpdateEntryMutation,
  type CreateEntryErrors,
  type EntryTableEntry,
} from "@/entities/entry"

interface TableModalProps {
  isOpen: boolean
  close: () => void
  entry: EntryTableEntry
}

interface Option {
  label: string
  value: string
}

const getUpdateEntryErrors = (
  error: unknown,
): CreateEntryErrors | undefined => {
  if (!error || typeof error !== "object" || !("errors" in error)) {
    return undefined
  }

  return error.errors as CreateEntryErrors
}

const UpdateModal: FC<TableModalProps> = ({ isOpen, close, entry }) => {
  const { data: jobsData } = useGetJobsQuery({})
  const [updateEntry, { isLoading, error }] = useUpdateEntryMutation()

  const [date, setDate] = useState<Dayjs | null>(dayjs(entry.date))
  const [jobType, setJobType] = useState(entry.job.id.toString())
  const [amount, setAmount] = useState(entry.amount.toString())
  const [unitList, setUnitList] = useState<Option[]>([])
  const [unitType, setUnitType] = useState(entry.unit.id.toString())
  const [workerName, setWorkerName] = useState(entry.worker_name)

  useEffect(() => {
    if (!jobsData) {
      return
    }
    const job = jobsData.jobList.find((job) => job.key === jobType)
    if (!job) {
      return
    }
    const unitList = job.units
    if (!unitList) {
      return
    }

    setUnitList(
      unitList.map((unit) => ({
        label: unit.name,
        value: unit.id.toString(),
      })),
    )
  }, [jobsData, jobType])

  const updateEntryErrors = getUpdateEntryErrors(error)

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
      const response = await updateEntry({
        id: entry.id,
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
      title="Редактирование записи"
      okButtonProps={{ loading: isLoading, disabled: isLoading }}
      okText="Изменить"
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
            {updateEntryErrors?.date && (
              <Typography.Text type="danger">
                {updateEntryErrors.date}
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
          {updateEntryErrors?.job_id && (
            <Typography.Text type="danger">
              {updateEntryErrors.job_id}
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
            {updateEntryErrors?.unit_id && (
              <Typography.Text type="danger">
                {updateEntryErrors.unit_id}
              </Typography.Text>
            )}
            {updateEntryErrors?.amount && (
              <Typography.Text type="danger">
                {updateEntryErrors.amount}
              </Typography.Text>
            )}
          </Flex>
        </Form.Item>
        <Form.Item label="ФИО">
          <Input
            value={workerName}
            onChange={(e) => setWorkerName(e.target.value)}
          />
          {updateEntryErrors?.worker_name && (
            <Typography.Text type="danger">
              {updateEntryErrors.worker_name}
            </Typography.Text>
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateModal
