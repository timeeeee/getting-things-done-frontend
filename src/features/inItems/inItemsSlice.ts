// import { createSlice, createAsyncThunk, createEntityAdapter, PayloadAction } from "@reduxjs/toolkit"

import { createAppSlice } from '../../app/createAppSlice'
import client from '../../app/api'
import type { LoadingStatus } from '../../app/types'

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

type InItem = {
    id: string,
    description: string,
    created_at: string,
    processed_at: string | null
}

type InItemsSliceState = {
  ids: string[],
  status: LoadingStatus,
  inItems: { [key: string]: InItem }
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
                console.log("called async thunk")
                const response = await client.getInItems()
                return response
            },
            {
                pending: state => {
                    state.status = "loading"
                },
                fulfilled: (state, action) => {
                    // replace the ids
                    state.ids = action.payload.map((inItem: InItem) => inItem.id)
                    state.ids.sort()

                    // replace the entities
                    state.inItems = {}
                    action.payload.forEach((inItem: InItem) => state.inItems[inItem.id] = inItem)
                    
                    // set the status
                    state.status = "idle"
                },
                rejected: (state: InItemsSliceState) => {
                    state.status = "failed"
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

export const { fetchAllInItems } = inItemsSlice.actions

export const { selectInItems, selectInItemByID } = inItemsSlice.selectors
