const express = require('express');
const router = express.Router();
const { getShelters } = require('../controllers/shelterController');

router.get('/', getShelters);

module.exports = router;