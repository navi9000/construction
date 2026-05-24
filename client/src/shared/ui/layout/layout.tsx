import { FC } from "react"
import { Outlet } from "react-router"
import { Flex } from "antd"
import TextButton from "./text-button"

const Layout: FC = () => {
  return (
    <>
      <header>
        <Flex justify="end" align="center" gap="small">
          <TextButton pathname="/">Записи</TextButton>
          <TextButton pathname="/jobs">Работы</TextButton>
        </Flex>
      </header>
      <Outlet />
    </>
  )
}

export default Layout
