import { createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit"

import { createAppSlice } from '../../app/createAppSlice'
import client from '../../app/api'
import type { LoadingStatus } from '../../app/types'
import type { RootState } from "../../app/store"

/*
    this slice will
    - use normal createAsyncThunk
    - use createEntityAdapter
*/

type Bucket = "trash" | "maybe" | "active" | "complete"

type Project = {
    id: string,
    name: string,
    notes: string,
    bucket: Bucket,
    created_at: string,
    updated_at: string
}

const projectAdapter = createEntityAdapter()

export const fetchAllProjects = createAsyncThunk(
    'projects/fetchProjects',
    async (_, { rejectWithValue }) => {
        try {
            return await client.getProjects()
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

const initialLoadingState: {loading: LoadingStatus} = {loading: "idle"}

export const projectsSlice = createAppSlice({
    name: "projects",
    initialState: projectAdapter.getInitialState(initialLoadingState),
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchAllProjects.pending, (state, action) => {
            state.loading = "loading"
        })

        builder.addCase(fetchAllProjects.fulfilled, (state, action) => {
            projectAdapter.setAll(state, action.payload)
            state.loading = "idle"
        })

        builder.addCase(fetchAllProjects.rejected, (state, action) => {
            state.loading = "failed"
        })
    }
})

export const {
    selectIds: selectProjectIds,
    selectById: selectProjectById
} = projectAdapter.getSelectors((state: RootState) => state.projects)


/*
export const inItemsSlice = createAppSlice({
    name: "inItems",
    initialState,
    reducers: create => ({
        fetchAllInItems: create.asyncThunk(
            async (_, { rejectWithValue }) => {
                try {
                    const response = await client.getInItems()
                    return response
                } catch (error: any) {
                    return rejectWithValue(error.message)
                }
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
            async (inItem: InItemState, { rejectWithValue }) => {
                try {
                    const response = await client.updateInItem(inItem.id, inItem.description, inItem.processedAt)
                    return response
                } catch (error: any) {
                    return rejectWithValue(error.message)
                }
            }
        ),
        createInItem: create.asyncThunk(
            async (description: string, { rejectWithValue }) => {
                try {
                    const response = await client.createInItem(description)
                    return response
                } catch (error: any) {
                    return rejectWithValue(error.message)
                }
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
            async (id: string, { rejectWithValue }) => {
                try {
                    const response = await client.deleteInItem(id)
                    return response
                } catch (error: any) {
                    return rejectWithValue(error.message)
                }
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
*/

