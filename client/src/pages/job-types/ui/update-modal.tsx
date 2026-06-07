import {
  JobTableEntry,
  type CreateJobErrors,
  useUpdateJobMutation,
} from "@/entities/job"
import { useAddUnitMutation, useGetUnitsQuery } from "@/entities/unit"
import { FormErrorMessage } from "@/shared/ui"
import { diff } from "@/shared/utils/arrays"
import { Modal, Input, Form, Select, Button } from "antd"
import { FC, MouseEventHandler, useState } from "react"

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
  unitIds: string[]
}

const getJobFormValues = (job: JobTableEntry): JobFormData => ({
  name: job.name,
  unitIds: job.units.map((unit) => unit.id.toString()),
  id: job.id,
})

const initialState: JobFormData = {
  name: "",
  unitIds: [],
  id: -1,
}

const UpdateModal: FC<TableModalProps> = ({ isOpen, close, job }) => {
  const { data } = useGetUnitsQuery()
  const [addUnit, { isLoading: isAddingUnit }] = useAddUnitMutation()
  const [updateJob, { isLoading: isUpdatingJob, error: updateJobError }] =
    useUpdateJobMutation()
  const [formValues, setFormValues] = useState(initialState)
  const [unitSearch, setUnitSearch] = useState("")
  const updateJobErrors = getUpdateJobErrors(updateJobError)

  if (job && formValues.id !== job?.id) {
    setFormValues(getJobFormValues(job))
  }

  const newUnitName = unitSearch.trim()
  const hasMatchingUnit = data?.optionList.some(
    (unit) => unit.label.toLowerCase() === newUnitName.toLowerCase(),
  )
  const canAddUnit = newUnitName.length > 0 && !hasMatchingUnit

  const handleAddUnit = async () => {
    if (!canAddUnit) {
      return
    }

    const createdUnit = await addUnit({ name: newUnitName }).unwrap()
    const createdUnitOption = {
      label: createdUnit.name,
      value: createdUnit.id.toString(),
    }

    setFormValues((currentValues) => {
      const alreadySelected = currentValues.unitIds.some(
        (unitId) => unitId === createdUnitOption.value,
      )

      return {
        ...currentValues,
        unitIds: alreadySelected
          ? currentValues.unitIds
          : [...currentValues.unitIds, createdUnitOption.value],
      }
    })
    setUnitSearch("")
  }

  const onSubmit: MouseEventHandler = async () => {
    if (!job) {
      return
    }
    const currUnits = formValues.unitIds.map(Number)
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
            showSearch={{
              searchValue: unitSearch,
              onSearch: setUnitSearch,
              optionFilterProp: "label",
            }}
            options={data.optionList}
            mode="multiple"
            value={formValues.unitIds}
            onChange={(unitIds) =>
              setFormValues((currentValues) => ({
                ...currentValues,
                unitIds,
              }))
            }
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
