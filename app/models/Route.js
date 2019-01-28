const mongoose = require('mongoose');
const { Schema } = mongoose;

const RouteSchema = new Schema({
    username: {
        type: String,
        index: true,
    },
    lats: {
        type: Array,
        index: true,
    },
    lons: {
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