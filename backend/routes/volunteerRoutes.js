const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { 
  registerVolunteer, 
  getVolunteers, 
  getVolunteerById,
  getMyProfile,
  updateMyProfile,
  updateMySkills
} = require('../controllers/volunteerController');
const { 
  getMyActiveTasks, 
  completeMyTask, 
  getMyTaskHistory 
} = require('../controllers/taskController');


router.post('/register', registerVolunteer);
router.get('/', getVolunteers);
router.use(authenticateToken);
router.get('/profile/me', getMyProfile);
router.put('/profile/me', updateMyProfile);
router.put('/profile/skills', updateMySkills);
router.get('/tasks/active', getMyActiveTasks);
router.get('/history', getMyTaskHistory);
router.get('/:id', getVolunteerById);

module.exports = router;