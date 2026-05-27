// import { useModalContext } from "@/pages/job-types/ui/modal-context"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"

interface Props {
  id: number
}

const DeleteButton: FC<Props> = ({ id }) => {
  //   const {
  //     update: { open },
  //   } = useModalContext()

  return (
    // <Button onClick={() => open(id)}>
    <Button>
      <DeleteOutlined />
    </Button>
  )
}

export default DeleteButton
