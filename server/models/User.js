const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // e.g., 'S001', 'F001'
    name: { type: String, required: true },
    email: { type: String },
    password: { type: String, required: true }, // Plain text as requested
    role: { type: String, required: true }, // 'admin', 'librarian', 'Student', 'Faculty'
    contactInfo: { type: String }
}, { timestamps: true });

// Transform output to ensure `_id` and `__v` are cleanly mapped/hidden if needed, though we primarily rely on our custom `id`
UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret._id = ret._id.toString();
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('User', UserSchema);
