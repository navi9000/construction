import Modal from "antd/es/modal"
import { FC, MouseEventHandler, useState } from "react"
import ModalForm from "./modal-form"
import observer from "@/shared/modules/observer"

interface TableModalProps {
  isOpen: boolean
  close: () => void
}

const CreateModal: FC<TableModalProps> = ({ isOpen, close }) => {
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit: MouseEventHandler = async () => {
    setIsLoading(true)
    observer.notify({
      type: "create-job",
      resetLoader: () => setIsLoading(false),
    })
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
      okText="Создать"
      cancelText="Отмена"
      okButtonProps={{ disabled: isLoading, loading: isLoading }}
    >
      {isOpen && <ModalForm close={close} />}
    </Modal>
  )
}

export default CreateModal
