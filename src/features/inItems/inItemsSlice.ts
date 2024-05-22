// import { createSlice, createAsyncThunk, createEntityAdapter, PayloadAction } from "@reduxjs/toolkit"

import { createAppSlice } from '../../app/createAppSlice'
import client from '../../app/api'
import type { LoadingStatus } from '../../app/types'
import { InItemList } from './InItemList'

/*
const fetchInItems = createAsyncThunk(
    'inItems/fetchInItems',
    async () => {
        return await client.getInItems()
    }
)
*/

/*
const inItemsAdapter = createEntityAdapter({
    sortComparer: (a, b) => {
        if (a === b) {
            return 0
        } else if (a < b) {
            return 1
        } else {
            return -1
        }
    }
})
*/

type InItemState = {
    id: string,
    description: string,
    createdAt: string,
    processedAt?: string,
    status: LoadingStatus
}

type InItemsSliceState = {
  ids: string[],
  status: LoadingStatus,
  inItems: { [key: string]: InItemState }
}

const initialState: InItemsSliceState = {
    ids: [],
    status: "idle",
    inItems: {}
}

export const inItemsSlice = createAppSlice({
    name: "inItems",
    initialState,
    reducers: create => ({
        fetchAllInItems: create.asyncThunk(
            async () => {
                const response = await client.getInItems()
                return response
            },
            {
                pending: state => {
                    state.status = "loading"
                },
                fulfilled: (state, action) => {
                    // replace the ids
                    state.ids = action.payload.map((inItem: InItemState) => inItem.id)
                    state.ids.sort()

                    // replace the entities
                    state.inItems = {}
                    action.payload.forEach((inItem: InItemState) => state.inItems[inItem.id] = {...inItem, status: 'idle'})
    
                    // set the status
                    state.status = "idle"
                },
                rejected: (state: InItemsSliceState) => {
                    state.status = "failed"
                }
            }
        ),
        updateInItem: create.asyncThunk(
            async (inItem: InItemState) => {
                const response = await client.updateInItem(inItem.id, inItem.description, inItem.processedAt)
                return response
            }
        ),
        createInItem: create.asyncThunk(
            async (description: string) => {
                const response = await client.createInItem(description)
                return response
            },
            {
                pending: state => {
                    // figure out how to make this optimistic?
                    // state.status = "loading"
                },
                fulfilled: (state, action) => {
                    const item = action.payload

                    // add to ids
                    state.ids.push(item.id)
                    state.ids.sort()

                    // add the entity
                    state.inItems[item.id] = item
                    // set the status

                    // confirm on the screen that this item is updated correctly
                    // ...
                },
                rejected: (state: InItemsSliceState) => {
                    // undo this if the save failed 
                }
            }
        )
    }),
    selectors: {
        selectInItems: state => state.inItems,
        selectInItemByID: (state: InItemsSliceState, id: string) => state.inItems[id],
        selectInItemIDs: state => state.ids
    }
})

export const { fetchAllInItems, createInItem } = inItemsSlice.actions

export const { selectInItems, selectInItemByID, selectInItemIDs } = inItemsSlice.selectors
