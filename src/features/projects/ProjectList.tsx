import type { EntityId } from '@reduxjs/toolkit'

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
    type ProjectState,
    type ProjectData,
    selectProjectIds,
    selectProjectById,
    fetchAllProjects,
    createProject,
    updateProject,
    deleteProject
} from "./projectsSlice"
import { type Bucket } from "../../app/types"


// TODO: can EntityId type be more specific to this entity?
// possible reference: https://github.com/reduxjs/redux-toolkit/pull/3187
const Project = ({ projectId } : {projectId: EntityId}) => {
    const [ isEditing, setIsEditing ] = useState(false)

    const project: ProjectState = useAppSelector(state => selectProjectById(state, projectId))

    // would it be better to handle the saving here?
    if (isEditing) return <ProjectInEditMode projectId={projectId} onFinished={() => setIsEditing(false)} />

    return (
        <div className="project">
            <div className="title">
                <h2>{project.name}</h2>
                <span id="project-bucket">({project.bucket})</span>
            </div>
            <div className="project-notes">{project.notes}</div>
            <div className="next-step"><strong>Next step: {project.nextStep}</strong></div>
            <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
    )
}

const ProjectInEditMode = ({projectId, onFinished}: {projectId: EntityId, onFinished: () => void}) => {
    const dispatch = useAppDispatch()

    const project = useAppSelector(state => selectProjectById(state, projectId))

    const handleSave = (project: ProjectState) => {
        dispatch(updateProject(project))
        onFinished()
    }

    return (
        <ProjectForm
            projectId={projectId as string}
            initialName={project.name}
            initialNotes={project.notes}
            initialBucket={project.bucket}
            initialNextStep={project.nextStep}
            onCancel={onFinished}
            onSave={handleSave}
        />
    )
}

const NewProject = ({onFinished}: {onFinished: () => void}) => {
    const dispatch = useAppDispatch()

    const handleNewProject = (data: ProjectData) => {
        dispatch(createProject(data))
        onFinished()
    }

    return <ProjectForm onCancel={onFinished} onSave={handleNewProject} />
}

// is there a better way to make this dual purpose, other than to let onSave take either a ProjectData or a ProjectState value?
// maybe I could accept either an onSave or an onCreate?
const ProjectForm = ({
    projectId,
    initialName,
    initialNotes,
    initialBucket,
    initialNextStep,
    onCancel,
    onSave
}: {
    projectId?: string,
    initialName?: string,
    initialNotes?: string,
    initialBucket?: Bucket,
    initialNextStep?: string,
    onCancel: () => void,
    // Todo: give onSave a type
    // I expected this to accept either 
    // onSave: ((data: ProjectData) => void) | ((data: ProjectState) => void)
    onSave: any
}) => {
    const [ name, setName ] = useState(initialName ? initialName : "")
    const [ notes, setNotes ] = useState(initialNotes ? initialNotes : "")
    const [ bucket, setBucket ] = useState<Bucket>(initialBucket ? initialBucket : "active")
    const [ nextStep, setNextStep ] = useState(initialNextStep ? initialNextStep : "")

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)
    const handleNotesChange = (event: ChangeEvent<HTMLTextAreaElement>) => setNotes(event.target.value)
    // Is there a way to make this so that typescript infers that event.target.value will be a Bucket?
    const handleBucketChange = (event: ChangeEvent<HTMLSelectElement>) => setBucket(event.target.value as Bucket)
    const handleNextStepChange = (event: ChangeEvent<HTMLInputElement>) => setNextStep(event.target.value)

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        onSave({
            ...((projectId !== undefined) && {id: projectId}),
            name,
            notes,
            bucket,
            nextStep
        })
    }

    // todo: when someone hits escape, cancel editing
    return (
        <form className="project-edit-form" onSubmit={handleSubmit}>
            <input type="text" name="name" value={name} placeholder="name" onChange={handleNameChange} />
            <textarea name="notes" value={notes} placeholder="notes" onChange={handleNotesChange} />
            <div id="status">
                <label htmlFor="bucket">Status:</label>
                <select name="bucket" defaultValue="active" onChange={handleBucketChange} >
                    <option value="active">Active</option>
                    <option value="trash">Trash</option>
                    <option value="maybe">Maybe</option>
                    <option value="complete">Complete</option>
                </select>
            </div>
            <div id="next-step">
                <label htmlFor="next-step">Next Step:</label>
                <input type="text" name="next-step" value={nextStep} onChange={handleNextStepChange} />
            </div>
            <button type="submit">Save</button>
            <button onClick={onCancel}>Cancel</button>
        </form>
    )
}

export const ProjectList = () => {
    const dispatch = useAppDispatch()

    const [isNewProjectOpen, setIsNewProjectOpen] = useState(false)

    useEffect(() => {
        dispatch(fetchAllProjects())
    }, [])

    const projectIds = useAppSelector(selectProjectIds)

    return (
        <>
            {isNewProjectOpen ? 
                <NewProject onFinished={() => setIsNewProjectOpen(false)} />
                : <button onClick={() => setIsNewProjectOpen(true)}>Create Project</button>
            } 

            <ul id="project-list">
                {projectIds.map((id) =>
                    <li key={id}>
                        <Project projectId={id} />
                    </li>
                )}
            </ul>
        </>
    )
}