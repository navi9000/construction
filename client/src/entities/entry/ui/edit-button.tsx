import { useModalContext } from "@/pages/entry-list/ui/modal-context"
import { EditOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"

interface Props {
  id: number
}

const EditButton: FC<Props> = ({ id }) => {
  const {
    update: { open },
  } = useModalContext()

  return (
    <Button onClick={() => open(id)}>
      <EditOutlined />
    </Button>
  )
}

export default EditButton
