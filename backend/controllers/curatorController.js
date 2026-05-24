const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const {
  isValidEmailOrPhone,
  isValidPassword,
  isValidOrgName
} = require('../middleware/validation');

const prisma = new PrismaClient();
const saltRounds = 10;

async function createCuratorAccount(req, res) {
  try {
    const data = req.body;
    console.log('Шаг 1 - создание аккаунта куратора:', { emailOrPhone: data.emailOrPhone });

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

    const user = await prisma.user.create({
      data: {
        email: data.emailOrPhone.includes('@') ? data.emailOrPhone : null,
        phone: !data.emailOrPhone.includes('@') ? data.emailOrPhone : null,
        password: await bcrypt.hash(data.password, saltRounds),
      }
    });

    res.status(201).json({ 
      success: true, 
      message: 'Аккаунт создан, теперь укажите данные приюта',
      userId: user.id 
    });
  } catch (error) {
    console.error('Ошибка создания аккаунта куратора:', error);
    res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
  }
}

async function completeCuratorWithNewShelter(req, res) {
  try {
    const { userId, shelterData } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'Не найден ID пользователя' });
    }
    if (!shelterData || !isValidOrgName(shelterData.name)) {
      return res.status(400).json({ success: false, error: 'Введите название приюта' });
    }

    const result = await prisma.$transaction(async (prisma) => {
      const shelter = await prisma.shelter.create({
        data: {
          orgName: shelterData.name,
          description: shelterData.description || null,
          phone: shelterData.phone || '',
          email: shelterData.email || '',
          address: shelterData.address || '',
          logo: shelterData.logo || null,
        }
      });

      const curator = await prisma.curator.create({
        data: {
          userId: parseInt(userId),
          shelterId: shelter.id,
        }
      });

      return { curator, shelter };
    });

    res.status(201).json({ 
      success: true, 
      message: 'Куратор и приют успешно созданы'
    });
  } catch (error) {
    console.error('Ошибка создания приюта и куратора:', error);
    res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
  }
}

async function completeCuratorWithExistingShelter(req, res) {
  try {
    const { userId, shelterId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'Не найден ID пользователя' });
    }
    if (!shelterId) {
      return res.status(400).json({ success: false, error: 'Не выбран приют' });
    }

    const shelter = await prisma.shelter.findUnique({
      where: { id: parseInt(shelterId) }
    });

    if (!shelter) {
      return res.status(404).json({ success: false, error: 'Приют не найден' });
    }

    await prisma.curator.create({
      data: {
        userId: parseInt(userId),
        shelterId: parseInt(shelterId),
      }
    });

    res.status(201).json({ 
      success: true, 
      message: 'Куратор успешно привязан к приюту'
    });
  } catch (error) {
    console.error('Ошибка выбора приюта для куратора:', error);
    res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
  }
}

async function getCurators(req, res) {
  try {
    const curators = await prisma.curator.findMany({
      include: { user: true, shelter: true }
    });
    res.json({ success: true, data: curators });
  } catch (error) {
    console.error('Ошибка получения кураторов:', error);
    res.status(500).json({ success: false, error: 'Ошибка получения списка кураторов' });
  }
}

async function getCuratorById(req, res) {
  try {
    const { id } = req.params;
    const curator = await prisma.curator.findUnique({
      where: { id: parseInt(id) },
      include: { user: true, shelter: true }
    });
    
    if (!curator) {
      return res.status(404).json({ success: false, error: 'Куратор не найден' });
    }
    
    res.json({ success: true, data: curator });
  } catch (error) {
    console.error('Ошибка получения куратора:', error);
    res.status(500).json({ success: false, error: 'Ошибка получения данных куратора' });
  }
}

module.exports = {
  createCuratorAccount,
  completeCuratorWithNewShelter,
  completeCuratorWithExistingShelter,
  getCurators,
  getCuratorById
};