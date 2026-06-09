import { useAddJobMutation, type CreateJobErrors } from "@/entities/job"
import { FormErrorMessage } from "@/shared/ui"
import { Modal, Input, Form, Select, Button } from "antd"
import { FC, MouseEventHandler, useState } from "react"
import { useUnits } from "./use-units"

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
  const [addJob, { isLoading: isAddingJob, error: addJobError }] =
    useAddJobMutation()
  const [name, setName] = useState("")

  const addJobErrors = getCreateJobErrors(addJobError)

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
  } = useUnits()

  const onSubmit: MouseEventHandler = async () => {
    const { error } = await addJob({
      name,
      unit_ids: selectedUnits.map((unit) => Number(unit.value)),
    })

    if (!error) {
      setName("")
      setSelectedUnits([])
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
          <FormErrorMessage message={addJobErrors?.unit_ids} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateModal
