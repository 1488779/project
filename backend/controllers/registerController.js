const { PrismaClient } = require('@prisma/client');
const {
  isValidPhone,
  isValidEmail,
  isValidFullName,
  isValidCity,
  isValidOrgName,
  isValidAddress
} = require('../middleware/validation');

const prisma = new PrismaClient();

async function registerVolunteer(req, res) {
  try {
    const data = req.body;
    console.log('Получены данные волонтёра:', JSON.stringify(data, null, 2));

    if (!isValidFullName(data.fullName)) {
      return res.status(400).json({ success: false, error: 'Введите корректное ФИО (минимум 2 слова, только буквы)' });
    }
    if (!isValidPhone(data.phone)) {
      return res.status(400).json({ success: false, error: 'Введите корректный номер телефона (форматы: +7XXXXXXXXXX, 8XXXXXXXXXX)' });
    }
    if (data.email && !isValidEmail(data.email)) {
      return res.status(400).json({ success: false, error: 'Введите корректный email (например: name@mail.ru)' });
    }
    if (!isValidCity(data.city)) {
      return res.status(400).json({ success: false, error: 'Введите название города (минимум 2 символа)' });
    }

    // Проверка на дубликаты
    const existingByPhone = await prisma.volunteer.findFirst({ where: { phone: data.phone } });
    if (existingByPhone) {
      return res.status(409).json({ success: false, error: 'Пользователь с таким номером телефона уже зарегистрирован' });
    }
    if (data.email) {
      const existingByEmail = await prisma.volunteer.findFirst({ where: { email: data.email } });
      if (existingByEmail) {
        return res.status(409).json({ success: false, error: 'Пользователь с таким email уже зарегистрирован' });
      }
    }

    const volunteer = await prisma.volunteer.create({
      data: {
        fullName: data.fullName.trim(),
        phone: data.phone,
        email: data.email || null,
        city: data.city.trim(),
        photo: data.photo || null,
        skills: data.skills || [],
        hasExperience: data.hasExperience || false,
        preferredAnimals: data.preferredAnimals || [],
        considersFoster: data.considersFoster || false,
        hasCage: data.hasCage || false,
        hasSeparateRoom: data.hasSeparateRoom || false,
        maxFosterDays: data.maxFosterDays ? parseInt(data.maxFosterDays) : null,
      }
    });

    res.status(201).json({ success: true, message: 'Волонтёр успешно зарегистрирован', id: volunteer.id });
  } catch (error) {
    console.error('Ошибка при регистрации волонтёра:', error);
    res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера. Попробуйте позже.' });
  }
}

async function registerShelter(req, res) {
  try {
    const data = req.body;
    console.log('Получены данные приюта:', JSON.stringify(data, null, 2));

    if (!isValidOrgName(data.orgName)) {
      return res.status(400).json({ success: false, error: 'Введите название организации (минимум 3 символа)' });
    }
    if (!isValidPhone(data.phone)) {
      return res.status(400).json({ success: false, error: 'Введите корректный номер телефона (форматы: +7XXXXXXXXXX, 8XXXXXXXXXX)' });
    }
    if (!data.email || !isValidEmail(data.email)) {
      return res.status(400).json({ success: false, error: 'Введите корректный email (например: name@mail.ru)' });
    }
    if (!isValidAddress(data.address)) {
      return res.status(400).json({ success: false, error: 'Введите адрес (минимум 5 символов)' });
    }

    const existingByPhone = await prisma.shelter.findFirst({ where: { phone: data.phone } });
    if (existingByPhone) {
      return res.status(409).json({ success: false, error: 'Приют с таким номером телефона уже зарегистрирован' });
    }
    const existingByEmail = await prisma.shelter.findFirst({ where: { email: data.email } });
    if (existingByEmail) {
      return res.status(409).json({ success: false, error: 'Приют с таким email уже зарегистрирован' });
    }

    const shelter = await prisma.shelter.create({
      data: {
        orgName: data.orgName.trim(),
        legalStatus: data.legalStatus || 'НКО',
        phone: data.phone,
        email: data.email,
        address: data.address.trim(),
        website: data.website || null,
        logo: data.logo || null,
        requisites: data.requisites || null,
      }
    });

    res.status(201).json({ success: true, message: 'Приют успешно зарегистрирован', id: shelter.id });
  } catch (error) {
    console.error('Ошибка при регистрации приюта:', error);
    res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера. Попробуйте позже.' });
  }
}

async function registerOverexposure(req, res) {
  try {
    const data = req.body;
    console.log('Получены данные передержки:', JSON.stringify(data, null, 2));

    if (!isValidFullName(data.fullName)) {
      return res.status(400).json({ success: false, error: 'Введите корректное ФИО (минимум 2 слова, только буквы)' });
    }
    if (!isValidPhone(data.phone)) {
      return res.status(400).json({ success: false, error: 'Введите корректный номер телефона (форматы: +7XXXXXXXXXX, 8XXXXXXXXXX)' });
    }
    if (data.email && !isValidEmail(data.email)) {
      return res.status(400).json({ success: false, error: 'Введите корректный email (например: name@mail.ru)' });
    }
    if (!isValidCity(data.city)) {
      return res.status(400).json({ success: false, error: 'Введите название города (минимум 2 символа)' });
    }

    const existingByPhone = await prisma.overexposure.findFirst({ where: { phone: data.phone } });
    if (existingByPhone) {
      return res.status(409).json({ success: false, error: 'Пользователь с таким номером телефона уже зарегистрирован' });
    }
    if (data.email) {
      const existingByEmail = await prisma.overexposure.findFirst({ where: { email: data.email } });
      if (existingByEmail) {
        return res.status(409).json({ success: false, error: 'Пользователь с таким email уже зарегистрирован' });
      }
    }

    const overexposure = await prisma.overexposure.create({
      data: {
        fullName: data.fullName.trim(),
        phone: data.phone,
        email: data.email || null,
        city: data.city.trim(),
        photo: data.photo || null,
        hasCage: data.hasCage || false,
        hasSeparateRoom: data.hasSeparateRoom || false,
        hasOtherAnimals: data.hasOtherAnimals || false,
        maxDays: data.maxDays ? parseInt(data.maxDays) : null,
        acceptedAnimals: data.acceptedAnimals || [],
      }
    });

    res.status(201).json({ success: true, message: 'Передержка успешно зарегистрирована', id: overexposure.id });
  } catch (error) {
    console.error('Ошибка при регистрации передержки:', error);
    res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера. Попробуйте позже.' });
  }
}

async function getVolunteers(req, res) {
  try {
    const volunteers = await prisma.volunteer.findMany();
    res.json({ success: true, data: volunteers });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка получения списка волонтёров' });
  }
}

async function getShelters(req, res) {
  try {
    const shelters = await prisma.shelter.findMany();
    res.json({ success: true, data: shelters });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка получения списка приютов' });
  }
}

async function getOverexposures(req, res) {
  try {
    const overexposures = await prisma.overexposure.findMany();
    res.json({ success: true, data: overexposures });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка получения списка передержек' });
  }
}

module.exports = {
  registerVolunteer,
  registerShelter,
  registerOverexposure,
  getVolunteers,
  getShelters,
  getOverexposures
};