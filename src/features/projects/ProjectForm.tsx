import type { EntityId } from '@reduxjs/toolkit'

import { useState, type ChangeEvent, type FormEvent } from "react"
import type { ProjectData } from "./projectsSlice"
import { type Bucket } from "../../app/types"


export const ProjectForm = ({
    projectId, initialData, onSave
}: {
    projectId?: EntityId,
    initialData?: ProjectData,
    onSave: (data: ProjectData) => void,
}) => {
    const project: ProjectData = initialData === undefined ? {name: "", notes: "", bucket: "active", nextStep: ""} : initialData
    const [ name, setName ] = useState(project.name ? project.name : "")
    const [ notes, setNotes ] = useState(project.notes ? project.notes : "")
    const [ bucket, setBucket ] = useState<Bucket>(project.bucket ? project.bucket : "active")
    const [ nextStep, setNextStep ] = useState(project.nextStep ? project.nextStep : "")

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)
    const handleNotesChange = (event: ChangeEvent<HTMLTextAreaElement>) => setNotes(event.target.value)
    // Is there a way to make this so that typescript infers that event.target.value will be a Bucket?
    const handleBucketChange = (event: ChangeEvent<HTMLSelectElement>) => setBucket(event.target.value as Bucket)
    const handleNextStepChange = (event: ChangeEvent<HTMLInputElement>) => setNextStep(event.target.value)

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        onSave({name, notes, bucket, nextStep})
    }

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
        </form>
    )
}
