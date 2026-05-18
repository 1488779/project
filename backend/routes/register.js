const express = require('express');
const router = express.Router();
const {
  registerVolunteer,
  registerShelter,
  registerOverexposure,
  getVolunteers,
  getShelters,
  getOverexposures
} = require('../controllers/registerController');

// POST маршруты
router.post('/volunteer', registerVolunteer);
router.post('/shelter', registerShelter);
router.post('/overexposure', registerOverexposure);

// GET маршруты
router.get('/volunteers', getVolunteers);
router.get('/shelters', getShelters);
router.get('/overexposures', getOverexposures);

module.exports = router;