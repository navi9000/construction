import type { FC, ReactNode } from "react"
import { Button } from "antd"
import { useLocation } from "react-router"

interface TextButtonProps {
  pathname: string
  children: ReactNode
}

const TextButton: FC<TextButtonProps> = ({ pathname, children }) => {
  const currentPathname = useLocation().pathname
  return (
    <Button
      type="link"
      style={{ paddingInline: 0 }}
      href={pathname}
      disabled={currentPathname === pathname}
    >
      {children}
    </Button>
  )
}

export default TextButton
