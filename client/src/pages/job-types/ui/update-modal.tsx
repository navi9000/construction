import { JobTableEntry } from "@/entities/job"
import Modal from "antd/es/modal"
import { FC, MouseEventHandler, useState } from "react"
import observer from "@/shared/modules/observer"
import ModalForm from "./modal-form"

interface TableModalProps {
  isOpen: boolean
  close: () => void
  job: JobTableEntry | null
}

const UpdateModal: FC<TableModalProps> = ({ isOpen, close, job }) => {
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit: MouseEventHandler = async () => {
    setIsLoading(true)
    observer.notify({
      type: "update-job",
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
      okText="Изменить"
      cancelText="Отмена"
      okButtonProps={{ disabled: isLoading, loading: isLoading }}
    >
      {isOpen && <ModalForm job={job} close={close} />}
    </Modal>
  )
}

export default UpdateModal
