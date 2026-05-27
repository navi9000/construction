import { DeleteOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { useDeleteEntryMutation } from "../api/entries-api"

interface Props {
  id: number
}

const DeleteButton: FC<Props> = ({ id }) => {
  const [deleteEntry] = useDeleteEntryMutation()

  const onClick = async () => {
    try {
      const { error } = await deleteEntry(id)
      if (error) {
        alert("Не удалось удалить запись")
      }
    } catch {}
  }

  return (
    <Button onClick={onClick}>
      <DeleteOutlined />
    </Button>
  )
}

export default DeleteButton
