const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const {
  isValidEmailOrPhone,
  isValidPassword
} = require('../middleware/validation');

const prisma = new PrismaClient();
const saltRounds = 10;

async function registerOwner(req, res) {
  try {
    const data = req.body;
    console.log('Регистрация владельца:', { emailOrPhone: data.emailOrPhone });

    if (!isValidEmailOrPhone(data.emailOrPhone)) {
      return res.status(400).json({ success: false, error: 'Введите корректный email или номер телефона' });
    }
    if (!isValidPassword(data.password)) {
      return res.status(400).json({ success: false, error: 'Пароль должен быть не менее 6 символов' });
    }
    if (data.password !== data.confirmPassword) {
      return res.status(400).json({ success: false, error: 'Пароли не совпадают' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.emailOrPhone },
          { phone: data.emailOrPhone }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Пользователь с таким email/телефоном уже зарегистрирован' });
    }

    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email: data.emailOrPhone.includes('@') ? data.emailOrPhone : null,
          phone: !data.emailOrPhone.includes('@') ? data.emailOrPhone : null,
          password: await bcrypt.hash(data.password, saltRounds),
          fullName: data.name || null,
          role: 'owner'
        }
      });

      const owner = await prisma.owner.create({
        data: {
          userId: user.id,
          contactPhone: data.phone || null,
        }
      });

      return { user, owner };
    });

    res.status(201).json({ 
      success: true, 
      message: 'Владелец успешно зарегистрирован'
    });
  } catch (error) {
    console.error('Ошибка регистрации владельца:', error);
    res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
  }
}

async function getOwners(req, res) {
  try {
    const owners = await prisma.owner.findMany({
      include: { user: true }
    });
    res.json({ success: true, data: owners });
  } catch (error) {
    console.error('Ошибка получения владельцев:', error);
    res.status(500).json({ success: false, error: 'Ошибка получения списка владельцев' });
  }
}

async function getOwnerById(req, res) {
  try {
    const { id } = req.params;
    const owner = await prisma.owner.findUnique({
      where: { id: parseInt(id) },
      include: { user: true }
    });
    
    if (!owner) {
      return res.status(404).json({ success: false, error: 'Владелец не найден' });
    }
    
    res.json({ success: true, data: owner });
  } catch (error) {
    console.error('Ошибка получения владельца:', error);
    res.status(500).json({ success: false, error: 'Ошибка получения данных владельца' });
  }
}

module.exports = {
  registerOwner,
  getOwners,
  getOwnerById
};