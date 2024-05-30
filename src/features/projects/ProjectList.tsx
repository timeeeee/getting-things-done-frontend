import type { EntityId } from '@reduxjs/toolkit'

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectProjectIds, selectProjectById, fetchAllProjects } from "./projectsSlice"

export const Project = ({ projectId } : {projectId: EntityId}) => {
    const project = useAppSelector(state => selectProjectById(state, projectId))

    return (
        <div className="project">
            <p>{project.id}</p>
        </div>
    )
}

export const ProjectList = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchAllProjects)
    }, [])

    const projectIds = useAppSelector(selectProjectIds)

    return (
        <ul>
            {projectIds.map((id) =>
                <li key={id}>
                    <Project projectId={id} />
                </li>
            )}
        </ul>
    )
}