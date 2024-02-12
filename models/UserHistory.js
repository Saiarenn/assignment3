const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    method: {
        type: String,
        enum: ['GET', 'POST', 'PUT', 'DELETE'],
        required: true
    },
    endpoint: {
        type: String,
        required: true
    },
    parameters: mongoose.Schema.Types.Mixed,
    outcome: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const History = mongoose.model('History', historySchema);

module.exports = History;
