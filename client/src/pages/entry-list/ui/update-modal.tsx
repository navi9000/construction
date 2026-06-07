import { Modal, Input, Form, DatePicker, Space, Select, Flex } from "antd"
import { ChangeEventHandler, type FC, useState } from "react"
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
  entry: EntryTableEntry | null
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

type EntryFormData = {
  date: Dayjs | null
  jobType: string
  amount: string
  unitType: string
  workerName: string
  id: number
}

const getEntryData = (entry: EntryTableEntry): EntryFormData => {
  return {
    date: dayjs(entry.date),
    jobType: entry.job.id.toString(),
    amount: entry.amount.toString(),
    unitType: entry.unit.id.toString(),
    workerName: entry.worker_name,
    id: entry.id,
  }
}

const initialState: EntryFormData = {
  date: null,
  jobType: "",
  amount: "",
  unitType: "",
  workerName: "",
  id: -1,
}

const UpdateModal: FC<TableModalProps> = ({ isOpen, close, entry }) => {
  const { data: jobsData } = useGetJobsQuery()
  const [updateEntry, { isLoading, error }] = useUpdateEntryMutation()

  // const [date, setDate] = useState<Dayjs | null>(dayjs(entry.date))
  // const [jobType, setJobType] = useState(entry.job.id.toString())
  // const [amount, setAmount] = useState(entry.amount.toString())
  // const [unitType, setUnitType] = useState(entry.unit.id.toString())
  // const [workerName, setWorkerName] = useState(entry.worker_name)

  const [entryData, setEntryData] = useState(initialState)
  const unitList = getUnitList(jobsData, entryData.jobType)

  // useEffect(() => {
  //   setDate(dayjs(entry.date))
  //   setJobType(entry.job.id.toString())
  //   setAmount(entry.amount.toString())
  //   setUnitType(entry.unit.id.toString())
  //   setWorkerName(entry.worker_name)
  // }, [entry])

  if (entry && entryData.id !== entry.id) {
    setEntryData(getEntryData(entry))
  }

  const updateEntryErrors = getUpdateEntryErrors(error)

  const changeAmount: ChangeEventHandler<HTMLInputElement> = (e) => {
    const input = e.target.value
    if (!new RegExp(/^\d*\.?\d{0,}$/).test(input)) {
      return
    }
    // setAmount(input)
    setEntryData((prev) => ({ ...prev, amount: input }))
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
    // setJobType(job.key)
    // setUnitType("")
    setEntryData((prev) => ({
      ...prev,
      jobType: job.key,
      unitType: "",
    }))
  }

  const onSubmit = async () => {
    if (!entry) {
      return
    }
    try {
      const response = await updateEntry({
        id: entry.id,
        date: entryData.date?.format("YYYY-MM-DD") ?? "",
        unit_id: entryData.unitType ? Number(entryData.unitType) : -1,
        job_id: entryData.jobType ? Number(entryData.jobType) : -1,
        worker_name: entryData.workerName,
        amount: Number(entryData.amount),
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
              value={entryData.date}
              onChange={(date) => setEntryData((prev) => ({ ...prev, date }))}
            />
            <FormErrorMessage message={updateEntryErrors?.date} />
          </Flex>
        </Form.Item>
        <Form.Item label="Вид работ">
          <Select
            options={getJobOptions(jobsData)}
            value={entryData.jobType}
            onChange={onChangeJobType}
            notFoundContent={<div>Не найдено</div>}
          />
          <FormErrorMessage message={updateEntryErrors?.job_id} />
        </Form.Item>
        <Form.Item label="Объем">
          <Space.Compact style={{ width: "100%" }}>
            <Input value={entryData.amount} onChange={changeAmount} />
            <Select
              options={unitList}
              value={entryData.unitType}
              onChange={(unitType) =>
                setEntryData((prev) => ({ ...prev, unitType }))
              }
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
            value={entryData.workerName}
            onChange={(e) =>
              setEntryData((prev) => ({ ...prev, workerName: e.target.value }))
            }
          />
          <FormErrorMessage message={updateEntryErrors?.worker_name} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateModal
