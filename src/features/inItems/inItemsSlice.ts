import { createAppSlice } from '../../app/createAppSlice'
import client from '../../app/api'
import type { LoadingStatus } from '../../app/types'

/*
    this slice will
    - use the asyncThunkCreator to include thunks in the reducers
    - manually use a normalized state structure
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
            async (_) => {
                return await client.getInItems()
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
                return await client.updateInItem(inItem.id, inItem.description, inItem.processedAt)
            }
        ),
        createInItem: create.asyncThunk(
            async (description: string) => {
               return await client.createInItem(description)
            },
            {
                pending: state => {
                    // figure out how to make this optimistic?
                    // create draft item with "pending" status?
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
        ),
        deleteInItem: create.asyncThunk(
            async (id: string) => {
                return await client.deleteInItem(id)
            },
            {
                pending: (state, action) => {
                    const id = action.meta.arg
                    state.inItems[id].status = "loading"
                },
                fulfilled: (state, action) => {
                    const id = action.meta.arg
                    state.ids = state.ids.filter(item => item !== id)
                    delete state.inItems[id]
                },
                rejected: (state, action) => {
                    // todo: add error message
                    const id = action.meta.arg
                    state.inItems[id].status = "idle"
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

export const { fetchAllInItems, createInItem, deleteInItem } = inItemsSlice.actions

export const { selectInItems, selectInItemByID, selectInItemIDs } = inItemsSlice.selectors
