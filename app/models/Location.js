const mongoose = require('mongoose');
const { Schema } = mongoose;

const RouteSchema = new Schema({
    username: {
        type: String,
        index: true,
    },
    lat: {
        type: Array,
        index: true,
    },
    lon: {
        type: Array,
        index: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Route', RouteSchema);