import {
  useAddUnitMutation,
  useGetUnitsQuery,
  type UnitOption,
} from "@/entities/unit"
import { Modal, Input, Form, Select } from "antd"
import { FC, useState } from "react"

interface TableModalProps {
  isOpen: boolean
  close: () => void
}

const TableModal: FC<TableModalProps> = ({ isOpen, close }) => {
  const { data } = useGetUnitsQuery({})
  const [addUnit] = useAddUnitMutation()
  const [name, setName] = useState("")
  const [selectedUnits, setSelectedUnits] = useState<UnitOption[]>([])

  const onSubmit = () => {
    close()
  }

  const onCancel = () => {
    close()
  }

  if (!data) {
    return null
  }

  console.log({ data })

  return (
    <Modal
      open={isOpen}
      onOk={onSubmit}
      onCancel={onCancel}
      title="Новая запись"
    >
      <Form>
        <Form.Item label="Вид работ">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Item>
        <Form.Item label="Единица измерения">
          <Select
            options={data.optionList}
            mode="multiple"
            value={selectedUnits}
            onChange={setSelectedUnits}
            popupRender={(menu) => {
              console.log({ menu })
              return (
                <>
                  {menu}
                  <div>Test</div>
                </>
              )
            }}
            notFoundContent={<div>Не найдено</div>}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default TableModal
