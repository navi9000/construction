import type { CSSProperties, FC, ReactNode } from "react"
import Typography from "antd/es/typography"
import { useLocation, Link } from "react-router"

interface TextButtonProps {
  pathname: string
  children: ReactNode
}

const disabledStyles: CSSProperties = {
  cursor: "not-allowed",
  opacity: 0.5,
  color: "grey",
}

const TextButton: FC<TextButtonProps> = ({ pathname, children }) => {
  const currentPathname = useLocation().pathname
  return (
    <Typography.Text>
      <Link
        to={pathname}
        style={currentPathname === pathname ? disabledStyles : {}}
      >
        {children}
      </Link>
    </Typography.Text>

    // </Button>
  )
}

export default TextButton
