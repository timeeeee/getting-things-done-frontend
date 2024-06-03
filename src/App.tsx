import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link
} from "react-router-dom"

import "./App.css"
import { InItemList } from "./features/inItems/InItemList"
import { ProjectList } from "./features/projects/ProjectList"

const Layout = () => {
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
