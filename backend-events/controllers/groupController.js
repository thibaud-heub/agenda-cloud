const Group = require('../models/Group');

exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find();
        res.json(groups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createGroup = async (req, res) => {
    try {
        const group = new Group(req.body);
        await group.save();
        res.status(201).json(group);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getGroupById = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ error: 'Group not found' });
        res.json(group);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateGroup = async (req, res) => {
    try {
        const group = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!group) return res.status(404).json({ error: 'Group not found' });
        res.json(group);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const group = await Group.findByIdAndDelete(req.params.id);
        if (!group) return res.status(404).json({ error: 'Group not found' });
        res.json({ message: 'Group deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addUserToGroup = async (req, res) => {
    try {
        const groupId = req.params.id;
        const { userId } = req.body;

        // Trouver le groupe par son ID
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Ajouter l'utilisateur à la liste des utilisateurs du groupe
        if (!group.usersIds.includes(userId)) {
            group.usersIds.push(userId);
        }

        // Enregistrer les modifications
        await group.save();

        res.status(200).json({ message: 'User added to group successfully' });
    } catch (error) {
        console.error('Error adding user to group:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};