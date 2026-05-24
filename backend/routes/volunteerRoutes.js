const express = require('express');
const router = express.Router();
const { 
  registerVolunteer, 
  getVolunteers, 
  getVolunteerById 
} = require('../controllers/volunteerController');

router.post('/register', registerVolunteer);
router.get('/', getVolunteers);
router.get('/:id', getVolunteerById);

module.exports = router;