const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    console.error('Ошибка GET /api/tasks:', error);
    res.status(500).json({ error: 'Ошибка получения списка задач' });
  }
});

module.exports = router;