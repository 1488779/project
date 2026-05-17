const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const animals = await prisma.animal.findMany();
    res.json(animals);
  } catch (error) {
    console.error('Ошибка GET /api/animals:', error);
    res.status(500).json({ error: 'Ошибка получения списка животных' });
  }
});

module.exports = router;