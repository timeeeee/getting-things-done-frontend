// todo: get generic type RouteComponentProps from react-router-dom (or @types?)    
import { useParams } from "react-router-dom"
import type { EntityId } from "@reduxjs/toolkit"
import { useReducer } from "react"

import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { selectProjectById, updateProject, type ProjectData } from "./projectsSlice"
import { LoadingSpinner } from "../../common/LoadingSpinner"
import { ProjectForm } from "./ProjectForm"

type ProjectRouteParams = {
    id: string
}

export const ProjectDetailPage = () => {
    const params = useParams<ProjectRouteParams>() as ProjectRouteParams

    return <Project projectId={params.id} />
}


export const Project = ({ projectId } : {projectId: EntityId}) => {
    const dispatch = useAppDispatch()

    const project = useAppSelector(state => selectProjectById(state, projectId))

    const [isEditing, toggleEditMode] = useReducer(state => !state, false)

    const handleSave = (data: ProjectData) => {
        dispatch(updateProject({...project, ...data}))
        toggleEditMode()
    }

    if (isEditing) return <ProjectForm initialData={project} onSave={handleSave} onCancel={toggleEditMode} />

    return (
        <div className="project">
            {project.status === "loading" && <LoadingSpinner />}
            <div className="title">
                <span id="project-title"><h2>{project.name}</h2></span>
                <span id="project-bucket">({project.bucket})</span>
            </div>
            {project.error !== undefined && <div className="error">{project.error}</div>}
            <div className="next-step"><strong>Next step: {project.nextStep}</strong></div>
            <div className="project-notes">
                <h3>Notes:</h3>
                <div>{project.notes}</div>
            </div>        
            <button onClick={toggleEditMode}>Edit</button>
        </div>
    )
}