const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  createFosterRequest,
  getOwnerFosterRequests,
  getVolunteerFosterRequests,
  getFosterRequestById,
  updateFosterRequestStatus
} = require('../controllers/fosterController');

router.use(authenticateToken);

router.post('/', createFosterRequest);
router.get('/owner', getOwnerFosterRequests);
router.get('/volunteer', getVolunteerFosterRequests);
router.get('/:id', getFosterRequestById);
router.patch('/:id/status', updateFosterRequestStatus);

module.exports = router;