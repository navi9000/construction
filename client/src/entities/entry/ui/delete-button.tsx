import { DeleteOutlined } from "@ant-design/icons"
import Button from "antd/es/button"
import notification from "antd/es/notification"
import { FC } from "react"
import { useDeleteEntryMutation } from "../api/entries-api"

interface Props {
  id: number
}

const DeleteButton: FC<Props> = ({ id }) => {
  const [deleteEntry] = useDeleteEntryMutation()

  const onClick = async () => {
    const { error } = await deleteEntry(id)
    if (error) {
      notification.error({
        title: "Ошибка",
        description: "Не удалось удалить запись",
      })
    }
  }

  return (
    <Button onClick={onClick}>
      <DeleteOutlined />
    </Button>
  )
}

export default DeleteButton
