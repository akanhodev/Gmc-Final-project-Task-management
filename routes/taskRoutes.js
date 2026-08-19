const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All task routes require a valid logged-in user
router.use(protect);

router.route('/').get(getTasks).post(createTask);

router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
