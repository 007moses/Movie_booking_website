import  { useState } from 'react';

const UseApiFetch = () => {
    const [responseData, setResponseData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [apiKey, setApiKey] = useState(null);

    const baseUrl = "http://192.168.29.24:5000";

    function serverRequest(serverRequestParam) {
        const fetchUrl = baseUrl + serverRequestParam.apiUrl;
        const apiKeyParam = serverRequestParam.apiKey;

        const requestOptions = {
            method: serverRequestParam.method || "GET",
            headers: serverRequestParam.headers || { "Content-Type": "application/json" },
        };

        if (serverRequestParam.method !== "GET" && serverRequestParam.body) {
            requestOptions.body = JSON.stringify(serverRequestParam.body);
        }
        
        setIsLoading(true);
        setApiKey(apiKeyParam);
        setFetchError(null);

        fetch(fetchUrl, requestOptions)
        .then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `API error: ${response.status}`);
            }
            setResponseData(data);
            setIsLoading(false);
        })
        .catch((error) => {
            setFetchError(error.message);
            setIsLoading(false);
            console.error("Fetch error:", error.message);
        });
    }

    return {
        responseData,
        isLoading,
        apiKey,
        fetchError,
        serverRequest,
    };
};

export default UseApiFetch;
