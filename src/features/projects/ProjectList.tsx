import { Link } from "react-router-dom"
import type { EntityId } from "@reduxjs/toolkit"
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';

import { useAppDispatch, useAppSelector } from "../../app/hooks"
import type { LoadingStatus } from "../../app/types"
import {
    selectProjectIds,
    selectProjectById,
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

export const ProjectList = () => {
    const dispatch = useAppDispatch()

    const projectIds = useAppSelector(selectProjectIds)
    const loadingStatus = useAppSelector(state => state.projects.loading)
    const error = useAppSelector(state => state.projects.error)
    const pendingProject = useAppSelector(state => state.projects.pendingNewProject)

    const [isNewProjectDialogOpen, { open: openNewProjectDialog, close: closeNewProjectDialog }] = useDisclosure()

    const handleSave = (projectData: ProjectData) => {
        dispatch(createProject(projectData))
        closeNewProjectDialog()
    }

    if (loadingStatus === "loading") return <LoadingSpinner />

    if (loadingStatus === "failed") return <div className="error" >Failed to fetch projects: {error}</div>

    if (loadingStatus === "idle") return (
        <>
            <button onClick={openNewProjectDialog}>Create Project</button>
            <Modal opened={isNewProjectDialogOpen} onClose={closeNewProjectDialog} title="New Project">
                <ProjectForm onSave={handleSave} />
            </Modal>
            
            <ul id="project-list">
                {pendingProject !== undefined && <li key="pending"><ProjectPreviewBody projectData={pendingProject} /></li>}
                {projectIds.map((id) =>
                    <li key={id}>
                        <ProjectPreview projectId={id} />
                    </li>
                )}
            </ul>
        </>
    )
}