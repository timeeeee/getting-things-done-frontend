import camelCaseKeys from "camelcase-keys"
import snakecaseKeys from "snakecase-keys"

type Method = "GET" | "POST" | "PUT" | "PATCH"


/*
take care of general headers
convert body to/from snakeCase for the REST API
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

    const responseData = await response.json();
    return camelCaseKeys(responseData)
}


const client = {
    getInItems: async () => {
        return await requestAPI('/in-items', 'GET');
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
    }
}

export default client;