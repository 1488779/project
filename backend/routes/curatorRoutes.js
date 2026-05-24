const express = require('express');
const router = express.Router();
const { 
  createCuratorAccount,
  completeCuratorWithNewShelter,
  completeCuratorWithExistingShelter,
  getCurators,
  getCuratorById
} = require('../controllers/curatorController');

router.post('/create-account', createCuratorAccount);
router.post('/complete-with-new-shelter', completeCuratorWithNewShelter);
router.post('/complete-with-existing-shelter', completeCuratorWithExistingShelter);
router.get('/', getCurators);
router.get('/:id', getCuratorById);

module.exports = router;