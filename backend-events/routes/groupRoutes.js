const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router.get('/', groupController.getAllGroups);
router.post('/', groupController.createGroup);
router.get('/:id', groupController.getGroupById);
router.put('/:id', groupController.updateGroup);
router.delete('/:id', groupController.deleteGroup);
router.put('/:id/addUser', groupController.addUserToGroup);

module.exports = router;
