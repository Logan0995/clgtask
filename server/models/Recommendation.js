const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    reason: { type: String }
}, { timestamps: true });

RecommendationSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret._id = ret._id.toString();
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);
