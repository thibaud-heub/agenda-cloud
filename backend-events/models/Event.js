const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    room: { type: String, ref: 'Room', required: true },
    category: { type: String, ref: 'Category', required: true },
    groupsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    usersIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Event', eventSchema);
