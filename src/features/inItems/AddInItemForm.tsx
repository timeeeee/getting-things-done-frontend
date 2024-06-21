import { type ChangeEvent, type FormEvent, useState } from 'react'
import { Button } from "@mantine/core"

import { useAppDispatch } from "../../app/hooks"
import { createInItem } from "./inItemsSlice"

export const AddInItemForm = ({ disabled = false }) => {
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
                disabled={disabled}
            />
            <Button type="submit" disabled={disabled} size="compact-md">submit</Button>
        </form>
    )
}