const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // e.g., 'B001'
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String },
    status: { type: String, default: 'Available' }, // 'Available', 'Issued', 'Reserved'
    issuedTo: { type: String, default: null }, // memberId
    dueDate: { type: Date, default: null },
    coverUrl: { type: String },
    availableQuantity: { type: Number, default: 1 },
    issuedCount: { type: Number, default: 0 }
}, { timestamps: true });

BookSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret._id = ret._id.toString();
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Book', BookSchema);
