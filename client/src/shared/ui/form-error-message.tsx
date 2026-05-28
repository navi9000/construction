import { Typography } from "antd"
import { FC } from "react"

interface Props {
  message: string | undefined
}

const FormErrorMessage: FC<Props> = ({ message }) => {
  if (!message) {
    return null
  }

  return <Typography.Text type="danger">{message}</Typography.Text>
}

export default FormErrorMessage
