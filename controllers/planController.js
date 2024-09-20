const Plan = require('../models/planModel');
const asyncHandler = require('../utils/asyncHandler');
const redisClient = require('../utils/redisClient');

// Create a new investment plan
exports.createPlan = asyncHandler(async (req, res) => {
    const { plan_name, investment_amount, investment_type, target_goal, time_horizon } = req.body;

    const activePlans = await Plan.countDocuments({ user: req.user.id, status: 'active' });
    if (activePlans >= 5) {
        return res.status(400).json({ message: 'Limit exceeded: Max 5 active plans allowed' });
    }

    const plan = await Plan.create({
        plan_name,
        investment_amount,
        investment_type,
        target_goal,
        time_horizon,
        user: req.user.id,
    });

    res.status(201).json({ success: true, plan });
});
// Fetch plan by ID
exports.getPlanById = asyncHandler(async (req, res, next) => {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
        return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    res.status(200).json({ success: true, plan });
});
// Get all investment plans (paginated)
exports.getPlans = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const cachedData = await redisClient.get(`plans:${req.user.id}:${page}`);
    if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
    }

    const plans = await Plan.find({ user: req.user.id })
        .skip((page - 1) * limit)
        .limit(limit);

    await redisClient.set(`plans:${req.user.id}:${page}`, JSON.stringify(plans), 'EX', 60); // Cache for 1 minute

    res.status(200).json({ success: true, plans });
});

// Update an existing investment plan
exports.updatePlan = asyncHandler(async (req, res) => {
    const plan = await Plan.findById(req.params.id);

    if (!plan || plan.user.toString() !== req.user.id) {
        return res.status(404).json({ message: 'Plan not found' });
    }

    if (plan.status !== 'active') {
        return res.status(400).json({ message: 'Only active plans can be updated' });
    }

    Object.assign(plan, req.body);
    await plan.save();

    res.status(200).json({ success: true, plan });
});

// Delete an investment plan (only if status is 'canceled')
exports.deletePlan = asyncHandler(async (req, res) => {
    const plan = await Plan.findById(req.params.id);

    if (!plan || plan.user.toString() !== req.user.id) {
        return res.status(404).json({ message: 'Plan not found' });
    }

    if (plan.status !== 'canceled') {
        return res.status(400).json({ message: 'Only canceled plans can be deleted' });
    }

    await plan.remove();
    res.status(204).json({ success: true, message: 'Plan deleted' });
});
