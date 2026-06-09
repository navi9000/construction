import {
  JobTableEntry,
  type CreateJobErrors,
  useUpdateJobMutation,
} from "@/entities/job"
import { FormErrorMessage } from "@/shared/ui"
import { diff } from "@/shared/utils/arrays"
import { Modal, Input, Form, Select, Button } from "antd"
import { FC, MouseEventHandler, useState } from "react"
import { useUnits } from "./use-units"

interface TableModalProps {
  isOpen: boolean
  close: () => void
  job: JobTableEntry | null
}

const getUpdateJobErrors = (error: unknown): CreateJobErrors | undefined => {
  if (!error || typeof error !== "object" || !("errors" in error)) {
    return undefined
  }

  return error.errors as CreateJobErrors
}

type JobFormData = {
  id: number
  name: string
}

const getJobFormValues = (job: JobTableEntry): JobFormData => ({
  name: job.name,
  id: job.id,
})

const initialState: JobFormData = {
  name: "",
  id: -1,
}

const UpdateModal: FC<TableModalProps> = ({ isOpen, close, job }) => {
  const [updateJob, { isLoading: isUpdatingJob, error: updateJobError }] =
    useUpdateJobMutation()
  const [formValues, setFormValues] = useState(initialState)
  const updateJobErrors = getUpdateJobErrors(updateJobError)

  if (job && formValues.id !== job?.id) {
    setFormValues(getJobFormValues(job))
  }

  const {
    data,
    isAddingUnit,
    handleAddUnit,
    canAddUnit,
    newUnitName,
    selectedUnits,
    setSelectedUnits,
    unitSearch,
    setUnitSearch,
  } = useUnits({ job })

  const onSubmit: MouseEventHandler = async () => {
    if (!job) {
      return
    }
    const currUnits = selectedUnits.map((unit) => Number(unit.value))
    const prevUnits = job.units.map((unit) => unit.id)
    const { added, removed } = diff(currUnits, prevUnits)
    const { error } = await updateJob({
      id: job.id,
      name: formValues.name,
      units: {
        added,
        removed,
      },
    })

    if (!error) {
      close()
    }
  }

  const onCancel = () => {
    close()
  }

  if (!data) {
    return null
  }

  return (
    <Modal
      open={isOpen}
      onOk={onSubmit}
      onCancel={onCancel}
      title="Новая запись"
      okText="Изменить"
      cancelText="Отмена"
      okButtonProps={{ disabled: isUpdatingJob, loading: isUpdatingJob }}
    >
      <Form>
        <Form.Item label="Вид работ">
          <Input
            value={formValues.name}
            onChange={(e) =>
              setFormValues((currentValues) => ({
                ...currentValues,
                name: e.target.value,
              }))
            }
          />
          <FormErrorMessage message={updateJobErrors?.name} />
        </Form.Item>
        <Form.Item label="Единица измерения">
          <Select
            labelInValue
            showSearch={{
              searchValue: unitSearch,
              onSearch: setUnitSearch,
              optionFilterProp: "label",
            }}
            options={data.optionList}
            mode="multiple"
            value={selectedUnits}
            onChange={setSelectedUnits}
            popupRender={(menu) => {
              return (
                <>
                  {menu}
                  {canAddUnit && (
                    <Button
                      block
                      type="text"
                      loading={isAddingUnit}
                      onClick={handleAddUnit}
                    >
                      Добавить "{newUnitName}"
                    </Button>
                  )}
                </>
              )
            }}
            notFoundContent={<div>Не найдено</div>}
          />
          <FormErrorMessage message={updateJobErrors?.unit_ids} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateModal
