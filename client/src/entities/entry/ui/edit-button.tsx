import { useModalContext } from "@/widgets/modal"
import { EditOutlined } from "@ant-design/icons"
import Button from "antd/es/button"
import { FC } from "react"

interface Props {
  id: number
}

const EditButton: FC<Props> = ({ id }) => {
  const { open } = useModalContext()

  return (
    <Button onClick={() => open(id)}>
      <EditOutlined />
    </Button>
  )
}

export default EditButton
