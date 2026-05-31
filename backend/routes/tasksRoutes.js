const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  getTasksByModerationStatus,
  getAllTasksAdmin,
  approveTask,
  rejectTask,
  createTask,
  updateTask,
  deleteTask,
  takeTask,
  completeTask
} = require('../controllers/taskController');


router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.get('/all', getAllTasksAdmin);
router.get('/moderation/:status', getTasksByModerationStatus);

router.put('/:id/approve', approveTask);
router.put('/:id/reject', rejectTask);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.put('/:id/take', takeTask);
router.put('/:id/complete', completeTask);

module.exports = router;