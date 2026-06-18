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

    await prisma.$transaction(async (prisma) => {
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

      await prisma.volunteer.create({
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
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Неверный ID' });
    }
    
    const volunteer = await prisma.volunteer.findUnique({
      where: { id: id },
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

async function getMyProfile(req, res) {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { volunteer: true }
    });

    if (!user || !user.volunteer) {
      return res.status(404).json({ success: false, error: 'Профиль волонтёра не найден' });
    }

    const completedTasks = await prisma.task.count({
      where: {
        volunteerId: user.volunteer.id,
        status: 'completed'
      }
    });

    const totalHours = completedTasks * 2;

    const savedAnimals = await prisma.animal.count({
      where: {
        adoptedBy: user.id,
        adopted: true
      }
    });

    const profile = {
      id: user.id,
      name: user.fullName,
      email: user.email,
      phone: user.phone,
      city: user.city,
      avatar: user.avatar,
      stats: {
        tasks: completedTasks,
        hours: totalHours,
        saved: savedAnimals
      },
      skills: user.volunteer.skills
    };

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ success: false, error: 'Ошибка при получении профиля' });
  }
}

async function updateMyProfile(req, res) {
  try {
    const userId = req.user.id;
    const { fullName, city, avatar, phone, email } = req.body;

    await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: fullName !== undefined ? fullName : undefined,
        city: city !== undefined ? city : undefined,
        avatar: avatar !== undefined ? avatar : undefined,
        phone: phone !== undefined ? phone : undefined,
        email: email !== undefined ? email : undefined
      }
    });

    res.json({ success: true, message: 'Профиль обновлён' });
  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
    res.status(500).json({ success: false, error: 'Ошибка при обновлении профиля' });
  }
}

async function updateMySkills(req, res) {
  try {
    const userId = req.user.id;
    const { skills } = req.body;

    await prisma.volunteer.update({
      where: { userId: userId },
      data: { skills: skills }
    });

    res.json({ success: true, message: 'Навыки обновлены', data: { skills } });
  } catch (error) {
    console.error('Ошибка обновления навыков:', error);
    res.status(500).json({ success: false, error: 'Ошибка при обновлении навыков' });
  }
}

const getVolunteersCountByShelter = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const curator = await prisma.curator.findUnique({
      where: { userId: userId },
      include: { shelter: true }
    });
    
    if (!curator) {
      return res.status(403).json({ success: false, error: 'Вы не куратор' });
    }
    
    if (!curator.shelter.lat || !curator.shelter.lng) {
      return res.json({ success: true, count: 0 });
    }
    
    const allVolunteers = await prisma.volunteer.findMany({
      where: {
        lat: { not: null },
        lng: { not: null }
      },
      include: { user: true }
    });
    
    const { calculateDistance } = require('../utils/distance');
    const RADIUS = 5; // 5 км — средний радиус района в Екатеринбурге
    
    const nearbyVolunteers = allVolunteers.filter(v => {
      const distance = calculateDistance(
        curator.shelter.lat,
        curator.shelter.lng,
        v.lat,
        v.lng
      );
      return distance !== null && distance <= RADIUS;
    });
    
    res.json({ success: true, count: nearbyVolunteers.length });
  } catch (error) {
    console.error('Ошибка подсчёта волонтёров:', error);
    res.status(500).json({ success: false, error: 'Ошибка подсчёта волонтёров' });
  }
};

module.exports = {
  registerVolunteer,
  getVolunteers,
  getVolunteerById,
  getMyProfile,
  updateMyProfile,
  updateMySkills,
  getVolunteersCountByShelter
};