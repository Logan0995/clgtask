const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    bookId: { type: String, required: true },
    bookTitle: { type: String, required: true },
    memberId: { type: String, required: true },
    type: { type: String, enum: ['issue', 'return'], required: true },
    status: { type: String, required: true }, // 'Pending', 'Return Pending', 'Faculty Long-term Reserve Pending'
    issueDate: { type: Date },
    returnDate: { type: Date }
}, { timestamps: true });

RequestSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret._id = ret._id.toString();
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Request', RequestSchema);
