import React, { useEffect } from 'react'
// import { useSelector } from 'react-redux'

import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { fetchAllInItems, selectInItems } from "./inItemsSlice"


export const InItemList = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        console.log("dispatching fetchAllInItems")
        dispatch(fetchAllInItems())
    }, [dispatch])

    const inItems = useAppSelector(selectInItems)

    return (
        <ul>
            {Object.values(inItems).map(item =>
                <li key={item.id}>{item.description}</li>
            )}
        </ul>
    )
}