import { Link } from "react-router-dom"
import type { EntityId } from "@reduxjs/toolkit"
import { useDisclosure } from '@mantine/hooks';
import { Modal, Tabs } from '@mantine/core';
import { useState } from 'react'

import type { Bucket } from "../../app/types"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import type { LoadingStatus } from "../../app/types"
import {
    selectProjectById,
    selectProjectIdsByBucket,
    createProject,
    type ProjectData
} from "./projectsSlice"
import { ProjectForm } from "./ProjectForm"
import { LoadingSpinner } from "../../common/LoadingSpinner"


const ProjectPreviewBody = ({ id, projectData, error, status }: {id?: EntityId, projectData: ProjectData, status?: LoadingStatus, error?: string }) => {
    return (
        <div className="project-preview">
            {status === "loading" && <LoadingSpinner />}
            <div className="title">
                <Link to={`/projects/${id}`}>
                    <span id="project-title"><h2>{projectData.name}</h2></span>
                <span id="project-bucket">({projectData.bucket})</span>
                </Link>
            </div>
            {error !== undefined && <div className="error">{error}</div>}
            <div className="next-step"><strong>Next step: {projectData.nextStep}</strong></div>
            <div className="project-notes">
                <h3>Notes:</h3>
                <div>{projectData.notes}</div>
            </div>
        </div>
    )
}

const ProjectPreview = ({ projectId }: {projectId: EntityId}) => {
    const project = useAppSelector(state => selectProjectById(state, projectId))

    return <ProjectPreviewBody id={projectId} projectData={project} error={project.error} status={project.status} />
}


const ProjectListTab = ({ bucket }: {bucket: Bucket}) => {
    const ids = useAppSelector(state => selectProjectIdsByBucket(state, bucket))
    const pendingProject = useAppSelector(state => state.projects.pendingNewProject)

    return (
        <Tabs.Panel key={bucket} value={bucket}>
            <ul>
                {pendingProject !== undefined && pendingProject.bucket === bucket &&
                    <li key="pending"><ProjectPreviewBody projectData={pendingProject} /></li>}

                {ids.map(id => (
                    <li key={id}><ProjectPreview projectId={id} /></li>
                ))}
            </ul>
        </Tabs.Panel>
    )
}


const buckets: Bucket[] = ["active", "complete", "maybe", "trash"]


export const ProjectList = () => {
    const dispatch = useAppDispatch()

    const loadingStatus = useAppSelector(state => state.projects.loading)
    const error = useAppSelector(state => state.projects.error)

    // todo: use history state to track selected tab
    /*
    const [activeTab, setActiveTab] = useReducer(
        (tab: Bucket) => {
            // todo: update history state
            console.log(`changing tab to ${tab}`)
            return tab
        },
        "maybe" 
    )
    */

    const [activeTab, setActiveTab] = useState<string | null>("active")

    const [isNewProjectDialogOpen, { open: openNewProjectDialog, close: closeNewProjectDialog }] = useDisclosure()

    const handleSave = (projectData: ProjectData) => {
        dispatch(createProject(projectData))
        closeNewProjectDialog()
    }

    if (loadingStatus === "loading") return <LoadingSpinner />

    if (loadingStatus === "failed") return <div className="error">Failed to fetch projects: {error}</div>

    // todo: make sure pending bucket fits selected bucket
    // todo: use router history state to remember which bucket we're on
    if (loadingStatus === "idle") return (
        <>
            <button onClick={openNewProjectDialog}>Create Project</button>
            <Modal opened={isNewProjectDialogOpen} onClose={closeNewProjectDialog} title="New Project">
                <ProjectForm onSave={handleSave} />
            </Modal>
            
            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List>
                    {buckets.map(bucket => <Tabs.Tab key={bucket} value={bucket}>{bucket}</Tabs.Tab>)}
                </Tabs.List>

                {buckets.map(bucket => <ProjectListTab bucket={bucket} />)}
            </Tabs>
        </>
    )
}