import {
  JobTableEntry,
  type CreateJobErrors,
  useUpdateJobMutation,
} from "@/entities/job"
import {
  useAddUnitMutation,
  useGetUnitsQuery,
  type UnitOption,
} from "@/entities/unit"
import { FormErrorMessage } from "@/shared/ui"
import { Modal, Input, Form, Select, Button } from "antd"
import { FC, MouseEventHandler, useEffect, useState } from "react"

interface TableModalProps {
  isOpen: boolean
  close: () => void
  job: JobTableEntry
}

const getUpdateJobErrors = (error: unknown): CreateJobErrors | undefined => {
  if (!error || typeof error !== "object" || !("errors" in error)) {
    return undefined
  }

  return error.errors as CreateJobErrors
}

const UpdateModal: FC<TableModalProps> = ({ isOpen, close, job }) => {
  const { data } = useGetUnitsQuery()
  const [addUnit, { isLoading: isAddingUnit }] = useAddUnitMutation()
  const [updateJob, { isLoading: isUpdatingJob, error: updateJobError }] =
    useUpdateJobMutation()
  const [jobId, setJobId] = useState(job.id)
  const [name, setName] = useState(job.name)
  const [selectedUnits, setSelectedUnits] = useState<UnitOption[]>(
    (data?.optionList ?? []).filter((option) =>
      job.units.map((unit) => unit.id.toString()).includes(option.value),
    ),
  )
  const [unitSearch, setUnitSearch] = useState("")
  const updateJobErrors = getUpdateJobErrors(updateJobError)

  console.log({ selectedUnits })

  useEffect(() => {
    if (jobId !== job.id) {
      setJobId(job.id)
      setName(job.name)
      setSelectedUnits(
        (data?.optionList ?? []).filter((option) =>
          job.units.map((unit) => unit.id.toString()).includes(option.value),
        ),
      )
    }
  }, [jobId, job, data])

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

    setSelectedUnits((currentUnits) => {
      const alreadySelected = currentUnits.some(
        (unit) => unit.value === createdUnitOption.value,
      )

      return alreadySelected
        ? currentUnits
        : [...currentUnits, createdUnitOption]
    })
    setUnitSearch("")
  }

  const onSubmit: MouseEventHandler = async () => {
    const { error } = await updateJob({
      id: job.id,
      name,
      units: {
        added: selectedUnits
          .map((unit) => Number(unit.value))
          .filter((id) => !job.units.map((unit) => unit.id).includes(id)),
        removed: job.units
          .map((unit) => unit.id)
          .filter(
            (id) =>
              !selectedUnits.map((unit) => Number(unit.value)).includes(id),
          ),
      },
    })
    console.log({ name, selectedUnits })

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
          <Input value={name} onChange={(e) => setName(e.target.value)} />
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
