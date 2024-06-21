// todo: get generic type RouteComponentProps from react-router-dom (or @types?)    
import { useParams } from "react-router-dom"
import type { EntityId } from "@reduxjs/toolkit"
import { useDisclosure } from "@mantine/hooks"
import { Modal, Button } from "@mantine/core"

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

    const [isEditing, { open: startEditing, close: stopEditing }] = useDisclosure()

    const handleSave = (data: ProjectData) => {
        dispatch(updateProject({...project, ...data}))
        stopEditing()
    }

    return (
        <div className="project">
            <Modal opened={isEditing} onClose={stopEditing} title="Edit Project">
                <ProjectForm initialData={project} onSave={handleSave} />
            </Modal>

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
            <Button onClick={startEditing}>Edit</Button>
        </div>
    )
}