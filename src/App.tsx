import { useEffect } from "react"
import "./App.css"
import { Counter } from "./features/counter/Counter"
import { Quotes } from "./features/quotes/Quotes"
import { InItemList } from "./features/inItems/InItemList"
import logo from "./logo.svg"

const App = () => {
  return (
    <div className="App">
      <InItemList />
    </div>
  )
}

export default App
