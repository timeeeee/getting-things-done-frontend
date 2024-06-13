import { createAsyncThunk, createEntityAdapter, type EntityId } from "@reduxjs/toolkit"

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

// everything needed to create a project
export type ProjectData = {
    name: string,
    notes: string,
    bucket: Bucket,
    nextStep: string
}

export type ProjectState = ProjectData & {
    id: EntityId,
    created_at?: string,
    updated_at?: string,
    status: LoadingStatus
}

const projectAdapter = createEntityAdapter<ProjectState>()

export const fetchAllProjects = createAsyncThunk(
    'projects/fetchProjects',
    async (_) => {
        return await client.getProjects()
    }
)

export const createProject = createAsyncThunk(
    'projects/createProject',
    async (project: ProjectData) => {
        return await client.createProject(
            project.name,
            project.notes,
            project.bucket,
            project.nextStep
        )
    }
)

export const updateProject = createAsyncThunk(
    'projects/updateProject',
    async (project: ProjectState) => {
        console.log("running async update project function")
        return await client.updateProject(
            project.id as string,
            project.name,
            project.notes,
            project.bucket,
            project.nextStep
        )
    }
)

export const deleteProject = createAsyncThunk(
    'projects/deleteProject',
    async (projectId: EntityId) => {
        await client.deleteProject(projectId as string)
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

        builder.addCase(createProject.pending, (state, action) => {
            // action.meta.arg will tell me the ProjectData but not the id
            // ... because the back-end hasn't made one yet lolol
            // figure out how to set this optimistically here
        })

        builder.addCase(createProject.fulfilled, (state, action) => {
            projectAdapter.addOne(state, action.payload)
            // todo: set the new project status to idle
        })

        builder.addCase(createProject.rejected, (state, action) => {
            // todo: put a message on the screen that saving this failed
        })

        builder.addCase(updateProject.pending, (state, action) => {
            console.log("update project pending")
            state.entities[action.meta.arg.id].status = "loading"
        })

        builder.addCase(updateProject.fulfilled, (state, action) => {
            projectAdapter.setOne(state, action.payload)
            state.entities[action.payload.id].status = "idle"
        })

        builder.addCase(updateProject.rejected, (state, action) => {

        })

        builder.addCase(deleteProject.pending, (state, action) => {
            state.entities[action.meta.arg].status = "loading"
        })

        builder.addCase(deleteProject.fulfilled, (state, action) => {
            projectAdapter.removeOne(state, action.meta.arg)
        })

        builder.addCase(deleteProject.rejected, (state, action) => {
            
        })
    }
})


export const {
    selectIds: selectProjectIds,
    selectById: selectProjectById,
} = projectAdapter.getSelectors((state: RootState) => state.projects)
