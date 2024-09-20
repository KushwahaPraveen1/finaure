const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    plan_name: { type: String, required: true },
    investment_amount: { type: Number, required: true },
    investment_type: { type: String, required: true },
    target_goal: { type: Number, required: true },
    time_horizon: { type: Date, required: true },
    status: { type: String, enum: ['active', 'completed', 'canceled'], default: 'active' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Plan', planSchema);
