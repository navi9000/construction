import { JobTableEntry } from "@/entities/job"
import { FormErrorMessage } from "@/shared/ui"
import { diff } from "@/shared/utils/arrays"
import { Modal, Input, Form, Select, Button } from "antd"
import { FC, MouseEventHandler } from "react"
import { useUnits } from "./use-units"
import { useJob } from "./use-job"

interface TableModalProps {
  isOpen: boolean
  close: () => void
  job: JobTableEntry | null
}

const UpdateModal: FC<TableModalProps> = ({ isOpen, close, job }) => {
  const { updateJob, isUpdatingJob, updateJobErrors, name, setName } = useJob({
    job,
  })

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
      name,
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
