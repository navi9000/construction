import { FC, PropsWithChildren } from "react"
import { ModalContext, ModalContextValues } from "./modal-context"

const ModalContextProvider: FC<PropsWithChildren<ModalContextValues>> = ({
  children,
  ...value
}) => {
  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}

export default ModalContextProvider
