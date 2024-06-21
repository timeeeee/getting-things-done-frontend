import { useEffect } from "react"
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link
} from "react-router-dom"
import '@mantine/core/styles.css'
import { createTheme, MantineProvider } from '@mantine/core'

import "./App.css"
import { useAppDispatch } from "./app/hooks"
import { InItemList } from "./features/inItems/InItemList"
import { ProjectList } from "./features/projects/ProjectList"
import { fetchAllInItems } from "./features/inItems/inItemsSlice"
import { fetchAllProjects } from "./features/projects/projectsSlice"
import { ProjectDetailPage } from "./features/projects/Project"



const theme = createTheme({
  /** Put your mantine theme override here */
});

const Layout = () => {
  // initial load of data from the API
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchAllInItems({}))
    dispatch(fetchAllProjects())
  }, [])

  return (
    <MantineProvider theme={theme}>
      <nav>
        <ul>
          <li><Link to="in-items">In Items</Link></li>
          <li><Link to="projects">Projects</Link></li>
        </ul>
      </nav>
      <Outlet />
      </MantineProvider>
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
