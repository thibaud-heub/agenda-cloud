const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_URL = 'https://example.com/api/'; 

// Fetch events
router.get('/events', async (req, res) => {
    try {
        const response = await axios.get(`${API_URL}event`);
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// Create event
router.post('/events', async (req, res) => {
    try {
        const response = await axios.post(`${API_URL}event`, req.body, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// Update event
router.put('/events/:id', async (req, res) => {
    try {
        const response = await axios.put(`${API_URL}event`, {
            ...req.body,
            eventId: req.params.id
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// Delete event
router.delete('/events/:id', async (req, res) => {
    try {
        const response = await axios.delete(`${API_URL}event`, {
            data: { eventId: req.params.id },
            headers: {
                'Content-Type': 'application/json',
            }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// Fetch groups
router.get('/groups', async (req, res) => {
    try {
        const response = await axios.get(`${API_URL}event`);
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// Create groups
router.post('/groups', async (req, res) => {
    try {
        const response = await axios.post(`${API_URL}event`, req.body, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// Update groups
router.put('/groups/:id', async (req, res) => {
    try {
        const response = await axios.put(`${API_URL}event`, {
            ...req.body,
            eventId: req.params.id
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// Delete groups
router.delete('/groups/:id', async (req, res) => {
    try {
        const response = await axios.delete(`${API_URL}event`, {
            data: { eventId: req.params.id },
            headers: {
                'Content-Type': 'application/json',
            }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});


// Fetch users
router.get('/users', async (req, res) => {
    try {
        const response = await axios.get(`${API_URL}event`);
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// Create users
router.post('/users', async (req, res) => {
    try {
        const response = await axios.post(`${API_URL}event`, req.body, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// Update users
router.put('/users/:id', async (req, res) => {
    try {
        const response = await axios.put(`${API_URL}event`, {
            ...req.body,
            eventId: req.params.id
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// Delete users
router.delete('/groups/:id', async (req, res) => {
    try {
        const response = await axios.delete(`${API_URL}event`, {
            data: { eventId: req.params.id },
            headers: {
                'Content-Type': 'application/json',
            }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});




module.exports = router;
