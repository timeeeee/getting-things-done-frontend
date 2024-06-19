// todo: get generic type RouteComponentProps from react-router-dom (or @types?)    
import { Link, useParams } from "react-router-dom"
import type { EntityId } from "@reduxjs/toolkit"

import { useAppSelector } from "../../app/hooks"
import { selectProjectById, type ProjectState } from "./projectsSlice"
import { LoadingSpinner } from "../../common/LoadingSpinner"

type ProjectRouteParams = {
    id: string
}

export const ProjectDetailPage = () => {
    const params = useParams<ProjectRouteParams>() as ProjectRouteParams

    return <Project projectId={params.id} />
}


export const Project = ({ projectId } : {projectId: EntityId}) => {
    const project: ProjectState = useAppSelector(state => selectProjectById(state, projectId))

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
            <Link to={`/projects/${projectId}/edit`}>Edit</Link>
        </div>
    )
}