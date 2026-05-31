const express = require('express');
const router = express.Router();
const {
  getAllAnimals,
  getAllAnimalsAdmin,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  getAnimalsByModerationStatus,
  approveAnimal,
  rejectAnimal,
  getSimilarAnimals
} = require('../controllers/animalController');

router.get('/', getAllAnimals);
router.get('/similar/:id', getSimilarAnimals);
router.get('/:id', getAnimalById);
router.get('/all', getAllAnimalsAdmin);
router.get('/moderation/:status', getAnimalsByModerationStatus);
router.put('/:id/approve', approveAnimal);
router.put('/:id/reject', rejectAnimal);
router.post('/', createAnimal);
router.put('/:id', updateAnimal);
router.delete('/:id', deleteAnimal);

module.exports = router;