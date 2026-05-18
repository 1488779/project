const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ========== ПОДКЛЮЧЕНИЕ МАРШРУТОВ ==========
const animalsRoutes = require('./routes/animals');
const tasksRoutes = require('./routes/tasks');
const registerRoutes = require('./routes/register');
const uploadRoutes = require('./routes/upload');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Папка uploads создана');
}

app.use('/uploads', express.static(uploadDir));

app.get('/', (req, res) => {
  res.json({ message: 'Сервер работает!' });
});

app.use('/api/animals', animalsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/upload', uploadRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});