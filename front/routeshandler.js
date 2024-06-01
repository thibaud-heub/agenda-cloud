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
router.put('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const groupsIds = req.body.groupsIds;
        const response = await axios.put(`${USERS_API}/users/${userId}`, { groupsIds });
        res.json(response.data);
    } catch (error) {
        console.error('Error updating user groups:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Route de connexion
router.post('/login', async (req, res) => {
    try {
        const response = await axios.post(`${USERS_API}/users/login`, req.body);
        // Vous pouvez ici traiter la réponse, comme l'enregistrement des données de session
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
});

// Route d'inscription
router.post('/signup', async (req, res) => {
    try {
        const response = await axios.post(`${USERS_API}/users`, req.body);
        // Traitement après inscription, par exemple envoi d'un email de confirmation
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Erreur lors de l’inscription' });
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

router.post('/rooms', async (req, res) => {
    try {
        const { name } = req.body;
        const response = await axios.post(`${EVENTS_API}/rooms`, { name });
        res.json(response.data);
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ error: 'Erreur serveur interne lors de la création de la room' });
    }
});

router.post('/groups', async (req, res) => {
    try {
        const { name } = req.body;
        const response = await axios.post(`${EVENTS_API}/groups`, { name });
        res.json(response.data);
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ error: 'Erreur serveur interne lors de la création du groupe' });
    }
});

async function fetchAdminData(req, res, next) {
    try {
        const usersResponse = await axios.get(`${USERS_API}/users`);
        const groupsResponse = await axios.get(`${EVENTS_API}/groups`);
        const roomsResponse = await axios.get(`${EVENTS_API}/rooms`);
        
        if (usersResponse.status === 200 && groupsResponse.status === 200 && roomsResponse.status === 200) {
            req.adminData = {
                users: usersResponse.data,
                groups: groupsResponse.data,
                rooms: roomsResponse.data
            };
            next();
        } else {
            throw new Error('Failed to fetch data');
        }
    } catch (error) {
        console.error('Failed to fetch admin data:', error);
        res.status(500).json({ error: 'Internal server error while fetching admin data' });
    }
}

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
// Mettre à jour les groupes d'un utilisateur
router.put('/users/:id/groups', async (req, res) => {
    const userId = req.params.id;
    const { groupsIds } = req.body;

    try {
        // Mettre à jour les groupes de l'utilisateur dans la base de données de l'utilisateur
        const updateUserResponse = await axios.put(`${USERS_API}/users/${userId}`, { groupsIds });
        if (updateUserResponse.status !== 200) {
            throw new Error(`Failed to update user's groups with status: ${updateUserResponse.status}`);
        }

        // Mettre à jour l'appartenance de l'utilisateur dans chaque groupe concerné
        const updateGroupsPromises = groupsIds.map(groupId =>
            axios.put(`${EVENTS_API}/groups/${groupId}/addUser`, { userId })
        );

        await Promise.all(updateGroupsPromises);

        res.json({ message: 'User and groups updated successfully!' });
    } catch (error) {
        console.error('Error updating user groups:', error);
        res.status(500).json({ error: 'Internal server error while updating user groups' });
    }
});

// Mettre à jour les utilisateurs d'un groupe
router.put('/groups/:id/users', async (req, res) => {
    const groupId = req.params.id;
    const { userIds } = req.body;

    try {
        // Mettre à jour les utilisateurs du groupe dans la base de données du groupe
        const updateGroupResponse = await axios.put(`${EVENTS_API}/groups/${groupId}`, { userIds });
        if (updateGroupResponse.status !== 200) {
            throw new Error(`Failed to update group's users with status: ${updateGroupResponse.status}`);
        }

        // Mettre à jour les groupes de chaque utilisateur concerné
        const updateUsersPromises = userIds.map(userId =>
            axios.put(`${USERS_API}/users/${userId}/addGroup`, { groupId })
        );

        await Promise.all(updateUsersPromises);

        res.json({ message: 'Group and users updated successfully!' });
    } catch (error) {
        console.error('Error updating group users:', error);
        res.status(500).json({ error: 'Internal server error while updating group users' });
    }
});


module.exports = {
    router,
    fetchAdminData
    
};
