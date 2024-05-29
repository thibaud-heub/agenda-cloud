const API_URL = '/';    

export const fetchEvents = () => {
    return fetch(`${API_URL}event`, { method: 'GET' })
        .then(response => response.json());
};

export const createEvent = (eventData) => {
    return fetch(`${API_URL}event`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
    })
    .then(response => response.json());
};

export const updateEvent = (eventId, updateData) => {
    return fetch(`${API_URL}event`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId, ...updateData })
    })
    .then(response => response.json());
};

export const deleteEvent = (eventId) => {
    return fetch(`${API_URL}event`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId })
    })
    .then(response => response.json());
};
