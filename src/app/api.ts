import camelCaseKeys from "camelcase-keys"
import snakecaseKeys from "snakecase-keys"

type Method = "GET" | "POST" | "PUT" | "PATCH"


// see https://codebrahma.com/intercepting-the-case-battle-between-snakes-and-camels-in-front-end-javascript/#fetch-api--custom-interceptors
// for other option

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
        let processedAtString
        
        /* the local state needs to be a string! so skipping this
        if (processedAt) {
            processedAtString = processedAt.toISOString()
        }
        */
        
        return await requestAPI(
            `/in-items/${id}`,
            'PUT',
            {
                description,
                processed_at: processedAtString
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