const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    memberId: { type: String, required: true },
    title: { type: String, required: true },
    returnDate: { type: Date, required: true }
}, { timestamps: true });

HistorySchema.set('toJSON', {
    transform: (doc, ret) => {
        ret._id = ret._id.toString();
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('History', HistorySchema);
