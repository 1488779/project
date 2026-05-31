const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

async function login(req, res) {
  try {
    const { emailOrPhone, password } = req.body;
    
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrPhone },
          { phone: emailOrPhone }
        ]
      }
    });
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Неверный email/телефон или пароль' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Неверный email/телефон или пароль' });
    }
    
    let role = null;
    const volunteer = await prisma.volunteer.findUnique({ where: { userId: user.id } });
    const curator = await prisma.curator.findUnique({ where: { userId: user.id } });
    const owner = await prisma.owner.findUnique({ where: { userId: user.id } });
    
    if (volunteer) role = 'volunteer';
    else if (curator) role = 'curator';
    else if (owner) role = 'owner';
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
}

module.exports = { login };