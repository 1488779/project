const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
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
  completeTask,
  getMyCreatedTasks
} = require('../controllers/taskController');


router.get('/', getAllTasks);
router.get('/my', authenticateToken, getMyCreatedTasks);
router.get('/admin/all', authenticateToken, getAllTasksAdmin);
router.get('/moderation/:status', authenticateToken, getTasksByModerationStatus);
router.get('/:id', getTaskById);

router.use(authenticateToken);

router.put('/:id/approve', approveTask);
router.put('/:id/reject', rejectTask);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.put('/:id/take', takeTask);
router.put('/:id/complete', completeTask);

module.exports = router;