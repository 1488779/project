const express = require('express');
const router = express.Router();
const { 
  registerOwner, 
  getOwners, 
  getOwnerById 
} = require('../controllers/ownerController');

router.post('/register', registerOwner);
router.get('/', getOwners);
router.get('/:id', getOwnerById);

module.exports = router;