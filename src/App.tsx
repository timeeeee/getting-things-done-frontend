import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"

import "./App.css"
import { InItemList } from "./features/inItems/InItemList"

const router = createBrowserRouter([
  {
    path: "/",
    element: <InItemList />,
  }
])

const App = () => {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
