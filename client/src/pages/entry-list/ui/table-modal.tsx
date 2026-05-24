import { Modal, Input, Form, DatePicker, Space, Select } from "antd"
import { FC } from "react"

interface TableModalProps {
  isOpen: boolean
  close: () => void
}

const TableModal: FC<TableModalProps> = ({ isOpen, close }) => {
  const onSubmit = () => {
    close()
  }

  const onCancel = () => {
    close()
  }

  return (
    <Modal
      open={isOpen}
      onOk={onSubmit}
      onCancel={onCancel}
      title="Новая запись"
    >
      <Form>
        <Form.Item label="Дата">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Вид работ">
          <Input />
        </Form.Item>
        <Form.Item label="Объем">
          <Space.Compact>
            <Input />
            <Select />
          </Space.Compact>
        </Form.Item>
        <Form.Item label="ФИО">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default TableModal
