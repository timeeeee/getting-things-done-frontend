import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { fetchAllInItems, deleteInItem, selectInItemByID, selectInItemIDs } from "./inItemsSlice"
import { AddInItemForm } from './AddInItemForm'


export const InItem = ({ inItemId }: { inItemId: string }) => {
    const dispatch = useAppDispatch()
    const inItem = useAppSelector(state => selectInItemByID(state, inItemId))

    const handleDelete = () => dispatch(deleteInItem(inItemId))

    return <li className="in-item">
        <span>{inItem.description}</span>
        <button className="delete" onClick={handleDelete}>🗑</button>
    </li>
}


export const InItemList = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        // todo: can fetchAllInItems be called with no arguments in a way that satisfied typescript?
        dispatch(fetchAllInItems({}))
    }, [dispatch])

    const inItemIDs = useAppSelector(selectInItemIDs)

    return (
        <div id="in-item-list">
            <AddInItemForm />
            <ul id="in-items">
                {inItemIDs.map(id =>
                    <InItem key={id} inItemId={id} />
                )}
            </ul>
        </div>
    )
}