const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mail: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    groupsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    eventsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
});

module.exports = mongoose.model('User', userSchema);
