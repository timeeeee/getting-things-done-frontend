import { useEffect } from 'react'
// import { useSelector } from 'react-redux'

import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { fetchAllInItems, selectInItemByID, selectInItemIDs } from "./inItemsSlice"
import { AddInItemForm } from './AddInItemForm'


export const InItem = ({ id }: { id: string }) => {
    const inItem = useAppSelector(state => selectInItemByID(state, id))

    return <li>{inItem.description}</li>
}


export const InItemList = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        console.log("dispatching fetchAllInItems")
        dispatch(fetchAllInItems())
    }, [dispatch])

    const inItemIDs = useAppSelector(selectInItemIDs)

    return (
        <div id="in-item-list">
            <ul id="in-items">
                {inItemIDs.map(id =>
                    <InItem key={id} id={id} />
                )}
            </ul>

            <AddInItemForm />
        </div>
    )
}