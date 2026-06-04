import { Modal, Input, Form, DatePicker, Space, Select, Flex } from "antd"
import { ChangeEventHandler, FC, useEffect, useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import { useGetJobsQuery, type GetJobsResponse } from "@/entities/job"
import {
  useUpdateEntryMutation,
  type CreateEntryErrors,
  type EntryTableEntry,
} from "@/entities/entry"
import { FormErrorMessage } from "@/shared/ui"

interface TableModalProps {
  isOpen: boolean
  close: () => void
  entry: EntryTableEntry
}

const getUpdateEntryErrors = (
  error: unknown,
): CreateEntryErrors | undefined => {
  if (!error || typeof error !== "object" || !("errors" in error)) {
    return undefined
  }

  return error.errors as CreateEntryErrors
}

const getUnitList = (
  jobsData: GetJobsResponse | undefined,
  jobType: string,
) => {
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

  return unitList.map((unit) => ({
    label: unit.name,
    value: unit.id.toString(),
  }))
}

const UpdateModal: FC<TableModalProps> = ({ isOpen, close, entry }) => {
  const { data: jobsData } = useGetJobsQuery()
  const [updateEntry, { isLoading, error }] = useUpdateEntryMutation()

  const [date, setDate] = useState<Dayjs | null>(dayjs(entry.date))
  const [jobType, setJobType] = useState(entry.job.id.toString())
  const [amount, setAmount] = useState(entry.amount.toString())
  const [unitType, setUnitType] = useState(entry.unit.id.toString())
  const [workerName, setWorkerName] = useState(entry.worker_name)
  const unitList = getUnitList(jobsData, jobType)

  useEffect(() => {
    setDate(dayjs(entry.date))
    setJobType(entry.job.id.toString())
    setAmount(entry.amount.toString())
    setUnitType(entry.unit.id.toString())
    setWorkerName(entry.worker_name)
  }, [entry])

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
    setJobType(job.key)
    setUnitType("")
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
    } catch (err) {
      console.log(err)
    }
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
            <FormErrorMessage message={updateEntryErrors?.date} />
          </Flex>
        </Form.Item>
        <Form.Item label="Вид работ">
          <Select
            options={getJobOptions(jobsData)}
            value={jobType}
            onChange={onChangeJobType}
            notFoundContent={<div>Не найдено</div>}
          />
          <FormErrorMessage message={updateEntryErrors?.job_id} />
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
            <FormErrorMessage message={updateEntryErrors?.unit_id} />
            <FormErrorMessage message={updateEntryErrors?.amount} />
          </Flex>
        </Form.Item>
        <Form.Item label="ФИО">
          <Input
            value={workerName}
            onChange={(e) => setWorkerName(e.target.value)}
          />
          <FormErrorMessage message={updateEntryErrors?.worker_name} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateModal
