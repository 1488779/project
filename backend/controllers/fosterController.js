const { PrismaClient } = require('@prisma/client');
const { createNotification } = require('./notificationController');
const prisma = new PrismaClient();

const createFosterRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { animalType, days, needsMeds, volunteerId, message } = req.body;
    
    const owner = await prisma.owner.findUnique({
      where: { userId: userId },
      include: { user: true }
    });
    
    if (!owner) {
      return res.status(403).json({ success: false, error: 'Только владельцы могут создавать заявки' });
    }
    
    const volunteer = await prisma.volunteer.findUnique({
      where: { id: parseInt(volunteerId) },
      include: { user: true }
    });
    
    const request = await prisma.fosterRequest.create({
      data: {
        animalType,
        days: parseInt(days),
        needsMeds: needsMeds || false,
        volunteerId: parseInt(volunteerId),
        ownerId: owner.id,
        message: message || null,
        status: 'open'
      }
    });
    
    await createNotification(
      volunteer.userId,
      'Новая заявка на передержку',
      `Владелец ${owner.user.fullName || 'Владелец'} ищет передержку для ${animalType} на ${days} дней`,
      'foster_request',
      `/foster-requests/${request.id}`
    );
    
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    console.error('Ошибка создания заявки:', error);
    res.status(500).json({ success: false, error: 'Ошибка создания заявки' });
  }
};

const getOwnerFosterRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const owner = await prisma.owner.findUnique({
      where: { userId: userId }
    });
    
    if (!owner) {
      return res.status(403).json({ success: false, error: 'Только владельцы могут просматривать заявки' });
    }
    
    const requests = await prisma.fosterRequest.findMany({
      where: { ownerId: owner.id },
      include: {
        volunteer: {
          include: { user: true }
        },
        animal: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ success: true, data: requests });
  } catch (error) {
    console.error('Ошибка получения заявок:', error);
    res.status(500).json({ success: false, error: 'Ошибка получения заявок' });
  }
};

const getVolunteerFosterRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const volunteer = await prisma.volunteer.findUnique({
      where: { userId: userId }
    });
    
    if (!volunteer) {
      return res.status(403).json({ success: false, error: 'Только волонтёры могут просматривать заявки' });
    }
    
    const requests = await prisma.fosterRequest.findMany({
      where: { volunteerId: volunteer.id },
      include: {
        owner: {
          include: { user: true }
        },
        animal: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ success: true, data: requests });
  } catch (error) {
    console.error('Ошибка получения заявок:', error);
    res.status(500).json({ success: false, error: 'Ошибка получения заявок' });
  }
};

const updateFosterRequestStatus = async (req, res) => {
  try {
    const requestId = parseInt(req.params.id);
    const { status } = req.body;
    const userId = req.user.id;
    
    const validStatuses = ['open', 'in_progress', 'completed', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Неверный статус' });
    }
    
    const request = await prisma.fosterRequest.findUnique({
      where: { id: requestId },
      include: { 
        owner: { include: { user: true } }, 
        volunteer: { include: { user: true } } 
      }
    });
    
    if (!request) {
      return res.status(404).json({ success: false, error: 'Заявка не найдена' });
    }

    const owner = await prisma.owner.findUnique({ where: { userId: userId } });
    const volunteer = await prisma.volunteer.findUnique({ where: { userId: userId } });
    
    const isOwner = owner && owner.id === request.ownerId;
    const isVolunteer = volunteer && volunteer.id === request.volunteerId;
    
    if (!isOwner && !isVolunteer) {
      return res.status(403).json({ success: false, error: 'Нет прав' });
    }
    
    await prisma.fosterRequest.update({
      where: { id: requestId },
      data: { status }
    });
    
    if (status === 'in_progress') {
      await createNotification(
        request.owner.userId,
        'Заявка одобрена',
        `Волонтёр ${request.volunteer.user.fullName || 'Волонтёр'} принял вашу заявку на передержку`,
        'foster_approved',
        `/foster-requests/${requestId}`
      );
    }
    
    if (status === 'rejected') {
      await createNotification(
        request.owner.userId,
        'Заявка отклонена',
        `Волонтёр отклонил вашу заявку на передержку`,
        'foster_rejected',
        `/foster-requests/${requestId}`
      );
    }
    
    if (status === 'completed') {
      await createNotification(
        request.volunteer.userId,
        'Передержка завершена',
        `Владелец забрал питомца. Спасибо за помощь!`,
        'foster_completed',
        `/foster-requests/${requestId}`
      );
    }
    
    res.json({ success: true, message: 'Статус обновлён' });
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
    res.status(500).json({ success: false, error: 'Ошибка обновления статуса' });
  }
};

const getFosterRequestById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user.id;
    
    const request = await prisma.fosterRequest.findUnique({
      where: { id },
      include: {
        owner: { include: { user: true } },
        volunteer: { include: { user: true } },
        animal: true
      }
    });
    
    if (!request) {
      return res.status(404).json({ success: false, error: 'Заявка не найдена' });
    }
    
    const owner = await prisma.owner.findUnique({ where: { userId: userId } });
    const volunteer = await prisma.volunteer.findUnique({ where: { userId: userId } });
    
    const isOwner = owner && owner.id === request.ownerId;
    const isVolunteer = volunteer && volunteer.id === request.volunteerId;
    
    if (!isOwner && !isVolunteer) {
      return res.status(403).json({ success: false, error: 'Нет прав' });
    }
    
    res.json({ success: true, data: request });
  } catch (error) {
    console.error('Ошибка получения заявки:', error);
    res.status(500).json({ success: false, error: 'Ошибка получения заявки' });
  }
};

module.exports = {
  createFosterRequest,
  getOwnerFosterRequests,
  getVolunteerFosterRequests,
  getFosterRequestById,
  updateFosterRequestStatus
};