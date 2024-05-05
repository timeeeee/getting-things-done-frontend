const fetchFromAPI = async (path: string) => {
    const url = `${import.meta.env.VITE_API_URL}${path}`;
    const response = await fetch(url, {mode: "cors"})
    const data = await response.json();
    return data
}

const client = {
    getInItems: async () => {
        return await fetchFromAPI('/in-items');
    }
}

export default client;