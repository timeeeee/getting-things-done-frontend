import { useReducer } from "react"
import { Link } from "react-router-dom"
import type { EntityId } from "@reduxjs/toolkit"

import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
    selectProjectIds,
    selectProjectById,
    createProject,
    type ProjectData
} from "./projectsSlice"
import { ProjectForm } from "./ProjectForm"
import { LoadingSpinner } from "../../common/LoadingSpinner"


const ProjectPreviewBody = ({ project }: {project: ProjectData}) => {
    return (
        <div className="project-preview">
            {project.status === "loading" && <LoadingSpinner />}
            <div className="title">
                <Link to={`/projects/${project.id}`}>
                    <span id="project-title"><h2>{project.name}</h2></span>
                <span id="project-bucket">({project.bucket})</span>
                </Link>
            </div>
            {project.error !== undefined && <div className="error">{project.error}</div>}
            <div className="next-step"><strong>Next step: {project.nextStep}</strong></div>
            <div className="project-notes">
                <h3>Notes:</h3>
                <div>{project.notes}</div>
            </div>
        </div>
    )
}

const ProjectPreview = ({ projectId }: {projectId: EntityId}) => {
    const project = useAppSelector(state => selectProjectById(state, projectId))

    return <ProjectPreviewBody project={project} />
}

export const ProjectList = () => {
    const dispatch = useAppDispatch()

    const projectIds = useAppSelector(selectProjectIds)
    const loadingStatus = useAppSelector(state => state.projects.loading)
    const error = useAppSelector(state => state.projects.error)
    const pendingProject = useAppSelector(state => state.projects.pendingNewProject)

    const [isNewProjectDialogOpen, toggleNewProjectDialog] = useReducer(state => !state, false)

    const handleSave = (projectData: ProjectData) => {
        dispatch(createProject(projectData))
        toggleNewProjectDialog()
    }

    if (loadingStatus === "loading") return <LoadingSpinner />

    if (loadingStatus === "failed") return <div className="error" >Failed to fetch projects: {error}</div>

    if (loadingStatus === "idle") return (
        <>
            {isNewProjectDialogOpen ?
                <ProjectForm onSave={handleSave} onCancel={toggleNewProjectDialog} />
                : <button onClick={toggleNewProjectDialog}>Create Project</button>
            }
            <ul id="project-list">
                {pendingProject !== undefined && <li key="pending"><ProjectPreviewBody project={pendingProject} /></li>}
                {projectIds.map((id) =>
                    <li key={id}>
                        <ProjectPreview projectId={id} />
                    </li>
                )}
            </ul>
        </>
    )
}