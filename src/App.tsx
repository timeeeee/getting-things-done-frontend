import { useEffect } from "react"
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link
} from "react-router-dom"

import "./App.css"
import { useAppDispatch } from "./app/hooks"
import { InItemList } from "./features/inItems/InItemList"
import { ProjectList } from "./features/projects/ProjectList"
import { fetchAllInItems } from "./features/inItems/inItemsSlice"
import { fetchAllProjects } from "./features/projects/projectsSlice"
import { ProjectDetailPage } from "./features/projects/Project"

const Layout = () => {
  // initial load of data from the API
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchAllInItems({}))
    dispatch(fetchAllProjects())
  }, [])

  return (
    <>
      <nav>
        <ul>
          <li><Link to="in-items">In Items</Link></li>
          <li><Link to="projects">Projects</Link></li>
        </ul>
      </nav>
      <Outlet />
    </>
  )
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    // errorElement: ...
    children: [
      {
        index: true,
        path: "/in-items",
        element: <InItemList />
      },
      {
        path: "/projects",
        element: <ProjectList />
      },
      {
        path: "/projects/:id",
        element: <ProjectDetailPage />
      }    
    ]
  },
])

const App = () => {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
