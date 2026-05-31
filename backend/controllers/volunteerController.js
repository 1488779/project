const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const {
  isValidPhone,
  isValidEmail,
  isValidFullName,
  isValidCity,
  isValidPassword
} = require('../middleware/validation');

const prisma = new PrismaClient();
const saltRounds = 10;

async function registerVolunteer(req, res) {
  try {
    const data = req.body;
    console.log('Регистрация волонтёра:', JSON.stringify(data, null, 2));

    if (!isValidFullName(data.fullName)) {
      return res.status(400).json({ success: false, error: 'Введите корректное ФИО (минимум 2 слова, только буквы)' });
    }
    if (!isValidPhone(data.phone)) {
      return res.status(400).json({ success: false, error: 'Введите корректный номер телефона' });
    }
    if (data.email && !isValidEmail(data.email)) {
      return res.status(400).json({ success: false, error: 'Введите корректный email' });
    }
    if (!isValidCity(data.city)) {
      return res.status(400).json({ success: false, error: 'Введите название города' });
    }
    if (!isValidPassword(data.password)) {
      return res.status(400).json({ success: false, error: 'Пароль должен быть не менее 6 символов' });
    }
    
    if (!data.agreeTerms) {
      return res.status(400).json({ success: false, error: 'Необходимо согласие с правилами платформы' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { phone: data.phone }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Пользователь с таким email или телефоном уже зарегистрирован' });
    }

    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email: data.email || null,
          phone: data.phone,
          password: await bcrypt.hash(data.password, saltRounds),
          fullName: data.fullName,
          city: data.city,
          avatar: data.photo || null,
          role: 'volunteer'
        }
      });

      const volunteer = await prisma.volunteer.create({
        data: {
          userId: user.id,
          skills: data.skills || [],
          hasExperience: data.hasExperience || false,
          preferredAnimals: data.preferredAnimals || [],
          considersFoster: data.considersFoster || false,
          hasCage: data.hasCage || false,
          hasSeparateRoom: data.hasSeparateRoom || false,
          maxFosterDays: data.maxFosterDays ? parseInt(data.maxFosterDays) : null,
          availableTime: data.availableTime || null,
          districts: data.districts || [],
          radius: data.radius || null,
          notifyEmail: data.notifyEmail || false,
          notifyPush: data.notifyPush || false,
          notifyDigest: data.notifyDigest || false,
        }
      });

      return { user, volunteer };
    });

    res.status(201).json({ 
      success: true, 
      message: 'Волонтёр успешно зарегистрирован'
    });
  } catch (error) {
    console.error('Ошибка регистрации волонтёра:', error);
    res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
  }
}

async function getVolunteers(req, res) {
  try {
    const volunteers = await prisma.volunteer.findMany({
      include: { user: true }
    });
    res.json({ success: true, data: volunteers });
  } catch (error) {
    console.error('Ошибка получения волонтёров:', error);
    res.status(500).json({ success: false, error: 'Ошибка получения списка волонтёров' });
  }
}

async function getVolunteerById(req, res) {
  try {
    const { id } = req.params;
    const volunteer = await prisma.volunteer.findUnique({
      where: { id: parseInt(id) },
      include: { user: true }
    });
    
    if (!volunteer) {
      return res.status(404).json({ success: false, error: 'Волонтёр не найден' });
    }
    
    res.json({ success: true, data: volunteer });
  } catch (error) {
    console.error('Ошибка получения волонтёра:', error);
    res.status(500).json({ success: false, error: 'Ошибка получения данных волонтёра' });
  }
}

module.exports = {
  registerVolunteer,
  getVolunteers,
  getVolunteerById
};