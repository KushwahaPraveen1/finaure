const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { restrictTo } = require('../middlewares/roleMiddleware');
const { createPlan, getPlans, getPlanById, updatePlan, deletePlan } = require('../controllers/planController');
const router = express.Router();

// Add the route to fetch a single plan by ID
router.get('/:id', protect, getPlanById);

router.post('/create', protect, createPlan);
router.get('/', protect, getPlans);
router.put('/:id', protect, restrictTo('user'), updatePlan);
router.delete('/:id', protect, restrictTo('user'), deletePlan);

module.exports = router;
