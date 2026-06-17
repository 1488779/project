const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getMyChats,
  getChatMessages,
  sendMessage,
  createChat
} = require('../controllers/chatController');

router.use(authenticateToken);

router.get('/', getMyChats);
router.post('/', createChat);
router.get('/:id/messages', getChatMessages);
router.post('/:id/messages', sendMessage);

module.exports = router;