import { EntryList } from "@/pages/entry-list"
import { JobTypes } from "@/pages/job-types"
import { NotFound } from "@/pages/not-found"
import { Layout } from "@/shared/ui"
import { FC } from "react"
import { createBrowserRouter, RouterProvider } from "react-router"

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <EntryList />,
      },
      {
        path: "/jobs",
        element: <JobTypes />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
])

const Routes: FC = () => {
  return <RouterProvider router={router} />
}

export default Routes
