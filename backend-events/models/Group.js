const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    usersIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    eventsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
});

module.exports = mongoose.model('Group', groupSchema);
