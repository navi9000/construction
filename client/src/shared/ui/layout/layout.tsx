import { FC } from "react"
import { Outlet } from "react-router"
import TextButton from "./text-button"

const Layout: FC = () => {
  return (
    <>
      <header>
        <nav className="app-nav">
          <TextButton pathname="/">Записи</TextButton>
          <TextButton pathname="/jobs">Работы</TextButton>
        </nav>
      </header>
      <Outlet />
    </>
  )
}

export default Layout
