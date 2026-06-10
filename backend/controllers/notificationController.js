const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createNotification = async (userId, title, body, type, link = null) => {
  try {
    if (!userId) return;
    
    await prisma.notification.create({
      data: {
        userId,
        title,
        body,
        type,
        link,
        isRead: false
      }
    });
  } catch (error) {
    console.error('Ошибка создания уведомления:', error);
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    
    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false }
    });
    
    res.json({
      success: true,
      data: notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Ошибка получения уведомлений:', error);
    res.status(500).json({ success: false, error: 'Ошибка получения уведомлений' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = parseInt(req.params.id);
    
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId }
    });
    
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Уведомление не найдено' });
    }
    
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка отметки уведомления:', error);
    res.status(500).json({ success: false, error: 'Ошибка отметки уведомления' });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка отметки всех уведомлений:', error);
    res.status(500).json({ success: false, error: 'Ошибка отметки всех уведомлений' });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = parseInt(req.params.id);
    
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId }
    });
    
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Уведомление не найдено' });
    }
    
    await prisma.notification.delete({ where: { id: notificationId } });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка удаления уведомления:', error);
    res.status(500).json({ success: false, error: 'Ошибка удаления уведомления' });
  }
};

module.exports = {
  createNotification,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};