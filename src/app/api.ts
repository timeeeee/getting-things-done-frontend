import camelCaseKeys from "camelcase-keys"
import snakecaseKeys from "snakecase-keys"

import type { Bucket } from "./types"
import { ProjectConfig } from "vitest"

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"


/*
take care of general headers
convert body to/from snakeCase for the REST API
if the response is "no content" return null
*/
const requestAPI = async (path: string, method: Method, data?: Record<string, string>) => {
    const url = `${import.meta.env.VITE_API_URL}${path}`;
    const requestData = data ? snakecaseKeys(data) : undefined
    const config: RequestInit = {
        mode: "cors",
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    }

    const response = await fetch(
        url,
        config
    )

    if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`)
    }

    // check for "no content"
    if (response.status === 204) return

    const responseData = await response.json()
    return camelCaseKeys(responseData)
}


const client = {
    // in items
    getInItems: async () => {
        return await requestAPI('/in-items', 'GET')
    },
    updateInItem: async (id: string, description: string, processedAt?: string) => {
        return await requestAPI(
            `/in-items/${id}`,
            'PUT',
            {
                description,
                ...(processedAt && { processedAt })
            }
        )
    },
    createInItem: async (description: string) => {
        return await requestAPI(
            '/in-items',
            'POST',
            {description}
        )
    },
    deleteInItem: async(id: string) => {
        await requestAPI(
            `/in-items/${id}`,
            'DELETE'
        )
    },
    
    // Projects
    getProjects: async () => {
        return await requestAPI('/projects', 'GET')
    },
    createProject: async (
        name: string,
        notes: string,
        bucket: Bucket,
        nextStep: string
    ) => {
        return await requestAPI(
            '/projects',
            'POST',
            { name, notes, bucket, nextStep }
        )
    },
    updateProject: async (id: string, name: string, notes: string, bucket: Bucket, nextStep: string) => {
        return await requestAPI(
            `/projects/${id}`,
            'PUT',
            {name, notes, bucket, nextStep}
        )
    },
    deleteProject: async(id: string) => {
        await requestAPI(
            `/projects/${id}`,
            'DELETE'
        )
    }
}

export default client;