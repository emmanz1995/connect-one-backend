const { Schema, model } = require('mongoose');

const prayerSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'prayer'
    },
    isAnswered: {
        type: Boolean,
    },
    prayedBy: {
        ref: 'user',
        type: Schema.Types.ObjectId
    },
}, { timestamps: true });

const Prayer = model('prayer', prayerSchema);
module.exports = Prayer;