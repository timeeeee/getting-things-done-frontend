import { Button } from "@mantine/core"

import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { deleteInItem, selectInItemByID, selectInItemIDs } from "./inItemsSlice"
import { AddInItemForm } from './AddInItemForm'
import { LoadingSpinner } from '../../common/LoadingSpinner'


export const InItem = ({ inItemId }: { inItemId: string }) => {
    const dispatch = useAppDispatch()
    const inItem = useAppSelector(state => selectInItemByID(state, inItemId))

    const handleDelete = () => dispatch(deleteInItem(inItemId))

    return <li className="in-item">
        <span>{inItem.description}</span>
        <Button className="delete" onClick={handleDelete}>🗑</Button>
    </li>
}


export const InItemList = () => {
    /*
    // doing this in App now
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchAllInItems({}))
    }, [dispatch])
    */

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