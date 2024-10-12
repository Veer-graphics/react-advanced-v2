const URL = 'http://localhost:3000';

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong")
    }
    return response.json();
}

export const getEvents = async () => {
    const res = await fetch(`${URL}/events`);
    return handleResponse(res);
}

export const getEventById = async (id) => {
    const res = await fetch(`${URL}/events/${id}`);
    return handleResponse(res);
}

export const getCategories = async () => {
    const res = await fetch(`${URL}/categories`);
    return handleResponse(res);
}

export const getUsers = async () => {
    const res = await fetch(`${URL}/users`);
    return handleResponse(res);
}

export const addEvent = async (newEvent) => {
    const res = await fetch(`${URL}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEvent),

    })
    const addedEvent = await handleResponse(res);

    // Fetch the newly added event by ID (assuming the response contains the `id` of the newly created event)
    const fetchedEvent = await getEventById(addedEvent.id);

    return fetchedEvent;
}

export const editEvent = async (id, updatedEvent) => {
    const res = await fetch(`${URL}/events/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedEvent),
    })
    return handleResponse(res);
}

export const deleteEvent = async (id) => {
    const res = await fetch(`${URL}/events/${id}`, {
        method: 'DELETE',
    });
    return handleResponse(res)
}