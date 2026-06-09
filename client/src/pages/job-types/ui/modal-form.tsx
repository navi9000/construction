import { type JobTableEntry } from "@/entities/job"
import { FormErrorMessage } from "@/shared/ui"
import { Button, Form, Input, Select } from "antd"
import { useCallback, type FC } from "react"
import { useJob } from "./use-job"
import { useUnits } from "./use-units"
import { diff } from "@/shared/utils/arrays"
import { useObserver } from "@/shared/modules/use-observer"

interface Props {
  job?: JobTableEntry | null
  close: () => void
}

const ModalForm: FC<Props> = ({ job = null, close }) => {
  const { addJob, updateJob, jobErrors, name, setName } = useJob({ job })

  const {
    optionList,
    isAddingUnit,
    handleAddUnit,
    canAddUnit,
    newUnitName,
    selectedUnits,
    setSelectedUnits,
    unitSearch,
    setUnitSearch,
  } = useUnits({ job })

  const handleCreateJob = useCallback(
    async ({
      type,
      resetLoader,
    }: {
      type: string
      resetLoader: () => void
    }) => {
      if (type !== "create-job") {
        return
      }
      const { error } = await addJob({
        name,
        unit_ids: selectedUnits.map((unit) => Number(unit.value)),
      })

      resetLoader()

      if (!error) {
        close()
      }
    },
    [name, selectedUnits],
  )

  const handleUpdateJob = useCallback(
    async ({
      type,
      resetLoader,
    }: {
      type: string
      resetLoader: () => void
    }) => {
      if (type !== "update-job") {
        return
      }

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

      resetLoader()

      if (!error) {
        close()
      }
    },
    [job, selectedUnits],
  )

  useObserver(handleCreateJob)
  useObserver(handleUpdateJob)

  return (
    <Form>
      <Form.Item label="Вид работ">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
        <FormErrorMessage message={jobErrors?.name} />
      </Form.Item>
      <Form.Item label="Единица измерения">
        <Select
          labelInValue
          showSearch={{
            searchValue: unitSearch,
            onSearch: setUnitSearch,
            optionFilterProp: "label",
          }}
          options={optionList}
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
        <FormErrorMessage message={jobErrors?.unit_ids} />
      </Form.Item>
    </Form>
  )
}

export default ModalForm
