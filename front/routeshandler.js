const express = require('express');
const router = express.Router();
const axios = require('axios');

const USERS_API = 'http://backend-users:3000';
const EVENTS_API = 'http://backend-events:3000';

// Proxy pour les utilisateurs
router.get('/users', async (req, res) => {
    try {
        const response = await axios.get(`${USERS_API}/users`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur interne' });
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const response = await axios.get(`${USERS_API}/users/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur interne' });
    }
});

// Proxy pour les événements
router.get('/categories', async (req, res) => {
    try {
        const response = await axios.get(`${EVENTS_API}/categories`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Erreur serveur interne' });
    }
});

router.get('/groups', async (req, res) => {
    try {
        const response = await axios.get(`${EVENTS_API}/groups`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ error: 'Erreur serveur interne' });
    }
});

router.get('/groups/:id', async (req, res) => {
    try {
        // Utilisation de Axios pour interroger une API externe
        const response = await axios.get(`${EVENTS_API}/groups/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching group:', error);
        res.status(500).json({ error: 'Erreur serveur interne' });
    }
});

router.get('/rooms', async (req, res) => {
    try {
        const response = await axios.get(`${EVENTS_API}/rooms`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: 'Erreur serveur interne' });
    }
});

// Proxy pour les événements
router.get('/events', async (req, res) => {
    try {
        const response = await axios.get(`${EVENTS_API}/events`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Erreur serveur interne' });
    }
});

router.post('/events', async (req, res) => {
    try {
        // Prend les données de l'événement du corps de la requête
        const { title, date, start_time, end_time, category, description, groupe } = req.body;

        // Crée l'objet de l'événement pour envoyer au backend d'événements
        const eventData = {
            title,
            date,
            start: date + 'T' + start_time,
            end: date + 'T' + end_time,
            category,
            description,
            groupsIds: [groupe], // Supposons que 'groupe' soit un ID valide
        };

        // Envoie la requête POST au service backend d'événements
        const response = await axios.post(`${EVENTS_API}/events`, eventData);

        // Renvoie la réponse du backend d'événements
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error posting event:', error);
        res.status(500).json({ error: 'Erreur lors de l’ajout de l’événement' });
    }
});


module.exports = router;
