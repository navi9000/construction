import { useAddJobMutation, type CreateJobErrors } from "@/entities/job"
import {
  useAddUnitMutation,
  useGetUnitsQuery,
  type UnitOption,
} from "@/entities/unit"
import { FormErrorMessage } from "@/shared/ui"
import { Modal, Input, Form, Select, Button, Typography } from "antd"
import { FC, MouseEventHandler, useState } from "react"

interface TableModalProps {
  isOpen: boolean
  close: () => void
}

const getCreateJobErrors = (error: unknown): CreateJobErrors | undefined => {
  if (!error || typeof error !== "object" || !("errors" in error)) {
    return undefined
  }

  return error.errors as CreateJobErrors
}

const CreateModal: FC<TableModalProps> = ({ isOpen, close }) => {
  const { data } = useGetUnitsQuery({})
  const [addUnit, { isLoading: isAddingUnit }] = useAddUnitMutation()
  const [addJob, { isLoading: isAddingJob, error: addJobError }] =
    useAddJobMutation()
  const [name, setName] = useState("")
  const [selectedUnits, setSelectedUnits] = useState<UnitOption[]>([])
  const [unitSearch, setUnitSearch] = useState("")
  const addJobErrors = getCreateJobErrors(addJobError)

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

  const onSubmit: MouseEventHandler = async (e) => {
    try {
      const { error } = await addJob({
        name,
        unit_ids: selectedUnits.map((unit) => Number(unit.value)),
      })

      if (!error) {
        setName("")
        setSelectedUnits([])
        close()
      }
    } catch {}
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
      okText="Создать"
      cancelText="Отмена"
      okButtonProps={{ disabled: isAddingJob, loading: isAddingJob }}
    >
      <Form>
        <Form.Item label="Вид работ">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <FormErrorMessage message={addJobErrors?.name} />
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
                    <div
                      style={{ padding: "8px" }}
                      onMouseDown={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                      }}
                    >
                      <Button
                        block
                        type="text"
                        loading={isAddingUnit}
                        onClick={handleAddUnit}
                      >
                        Добавить "{newUnitName}"
                      </Button>
                    </div>
                  )}
                </>
              )
            }}
            notFoundContent={<div>Не найдено</div>}
          />
          <FormErrorMessage message={addJobErrors?.unit_ids} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateModal
