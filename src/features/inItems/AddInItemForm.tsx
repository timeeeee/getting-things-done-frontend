import { type ChangeEvent, type FormEvent, useState } from 'react'

import { useAppDispatch } from "../../app/hooks"
import { createInItem } from "./inItemsSlice"

export const AddInItemForm = () => {
    const dispatch = useAppDispatch()

    const [ newInItem, setNewInItem ] = useState("")

    const handleInput = (event: ChangeEvent<HTMLInputElement>): void => {
        setNewInItem(event.target.value)
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        dispatch(createInItem(newInItem))
        setNewInItem("")
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                autoFocus
                placeholder="what to do?"
                onChange={handleInput}
                value={newInItem}
            />
            <button type="submit">submit</button>
        </form>
    )
}