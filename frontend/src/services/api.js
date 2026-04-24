export const submitGraphData = async (dataArray) => {
    try {
        const response = await fetch('http://localhost:8080/bfhl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: dataArray }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server responded with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message || 'Failed to connect to the server');
    }
};
