const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getIconByCategory = (category) => {
  const icons = {
    "Транспорт": "🚚",
    "Выгул": "🐕",
    "Ремонт": "🔧",
    "Уборка": "🧹",
    "Фото": "📷",
    "Ветеринария": "💊",
    "Сбор средств": "💰",
    "Другое": "📋"
  };
  return icons[category] || "📋";
};

const transformTask = (task) => {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    category: task.category,
    date: task.date,
    timeFrom: task.timeFrom,
    timeTo: task.timeTo,
    address: task.address,
    skills: task.skills,
    isUrgent: task.isUrgent,
    contactName: task.contactName,
    contactRole: task.contactRole,
    contactPhone: task.contactPhone,
    status: task.status,
    moderationStatus: task.moderationStatus,
    photos: task.photos,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    
    shelter: task.shelter?.orgName || null,
    icon: getIconByCategory(task.category),
    extraData: {
      category: task.category,
      categoryEmoji: getIconByCategory(task.category),
      description: task.description,
      date: task.date,
      timeFrom: task.timeFrom,
      timeTo: task.timeTo,
      address: task.address,
      skills: task.skills,
      contact: task.contactName ? {
        name: task.contactName,
        role: task.contactRole,
        phone: task.contactPhone
      } : null,
      photos: task.photos,
      rating: 0,
      urgent: task.isUrgent
    }
  };
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { moderationStatus: 'approved' },
      include: { shelter: true },
      orderBy: { createdAt: 'desc' }
    });
    
    const transformed = tasks.map(transformTask);
    res.json(transformed);
  } catch (error) {
    console.error('Ошибка GET /api/tasks:', error);
    res.status(500).json({ error: 'Ошибка получения списка задач' });
  }
};

const getTaskById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Неверный ID задачи' });
    }
    
    const task = await prisma.task.findUnique({ 
      where: { id: id },
      include: { shelter: true }
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    const transformed = transformTask(task);
    res.json(transformed);
  } catch (error) {
    console.error('Ошибка GET /api/tasks/:id:', error);
    res.status(500).json({ error: 'Ошибка получения задачи' });
  }
};

const getTasksByModerationStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Неверный статус' });
    }
    
    const tasks = await prisma.task.findMany({
      where: { moderationStatus: status },
      include: { shelter: true },
      orderBy: { createdAt: 'desc' }
    });
    
    const transformed = tasks.map(transformTask);
    res.json(transformed);
  } catch (error) {
    console.error('Ошибка GET /api/tasks/moderation/:status:', error);
    res.status(500).json({ error: 'Ошибка получения списка задач' });
  }
};

const getAllTasksAdmin = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: { shelter: true },
      orderBy: { createdAt: 'desc' }
    });
    
    const transformed = tasks.map(transformTask);
    res.json(transformed);
  } catch (error) {
    console.error('Ошибка GET /api/tasks/all:', error);
    res.status(500).json({ error: 'Ошибка получения списка' });
  }
};

const approveTask = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    const task = await prisma.task.update({
      where: { id },
      data: { moderationStatus: 'approved' }
    });
    
    res.json({ message: 'Задача одобрена', task });
  } catch (error) {
    console.error('Ошибка PUT /api/tasks/:id/approve:', error);
    res.status(500).json({ error: 'Ошибка одобрения задачи' });
  }
};

const rejectTask = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { reason } = req.body;
    
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    const task = await prisma.task.update({
      where: { id },
      data: { 
        moderationStatus: 'rejected'
      }
    });
    
    res.json({ message: 'Задача отклонена', task, reason: reason || null });
  } catch (error) {
    console.error('Ошибка PUT /api/tasks/:id/reject:', error);
    res.status(500).json({ error: 'Ошибка отклонения задачи' });
  }
};

const createTask = async (req, res) => {
  try {
    const {
      title, description, category, date, timeFrom, timeTo,
      address, skills, isUrgent, contactName, contactRole,
      contactPhone, photos, shelterId, createdById
    } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Название задачи обязательно' });
    }
    
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description || null,
        category: category || null,
        date: date || null,
        timeFrom: timeFrom || null,
        timeTo: timeTo || null,
        address: address || null,
        skills: skills || [],
        isUrgent: isUrgent || false,
        contactName: contactName || null,
        contactRole: contactRole || null,
        contactPhone: contactPhone || null,
        photos: photos || [],
        shelterId: shelterId || null,
        createdById: createdById || null,
        status: 'open',
        moderationStatus: 'pending'
      }
    });
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Ошибка POST /api/tasks:', error);
    res.status(500).json({ error: 'Ошибка создания задачи' });
  }
};

const updateTask = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      title, description, category, date, timeFrom, timeTo,
      address, skills, isUrgent, contactName, contactRole,
      contactPhone, photos, status
    } = req.body;
    
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    const task = await prisma.task.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : existingTask.title,
        description: description !== undefined ? description : existingTask.description,
        category: category !== undefined ? category : existingTask.category,
        date: date !== undefined ? date : existingTask.date,
        timeFrom: timeFrom !== undefined ? timeFrom : existingTask.timeFrom,
        timeTo: timeTo !== undefined ? timeTo : existingTask.timeTo,
        address: address !== undefined ? address : existingTask.address,
        skills: skills !== undefined ? skills : existingTask.skills,
        isUrgent: isUrgent !== undefined ? isUrgent : existingTask.isUrgent,
        contactName: contactName !== undefined ? contactName : existingTask.contactName,
        contactRole: contactRole !== undefined ? contactRole : existingTask.contactRole,
        contactPhone: contactPhone !== undefined ? contactPhone : existingTask.contactPhone,
        photos: photos !== undefined ? photos : existingTask.photos,
        status: status !== undefined ? status : existingTask.status
      }
    });
    
    res.json(task);
  } catch (error) {
    console.error('Ошибка PUT /api/tasks/:id:', error);
    res.status(500).json({ error: 'Ошибка обновления задачи' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    await prisma.task.delete({ where: { id } });
    res.json({ message: 'Задача удалена' });
  } catch (error) {
    console.error('Ошибка DELETE /api/tasks/:id:', error);
    res.status(500).json({ error: 'Ошибка удаления задачи' });
  }
};

const takeTask = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { volunteerId } = req.body;
    
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    const task = await prisma.task.update({
      where: { id },
      data: {
        volunteerId: volunteerId,
        status: 'active'
      }
    });
    
    res.json({ message: 'Задача взята в работу', task });
  } catch (error) {
    console.error('Ошибка PUT /api/tasks/:id/take:', error);
    res.status(500).json({ error: 'Ошибка' });
  }
};

const completeTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = parseInt(req.params.id || req.params.taskId);
    
    const volunteer = await prisma.volunteer.findUnique({
      where: { userId: userId }
    });

    if (!volunteer) {
      return res.status(404).json({ success: false, error: 'Волонтёр не найден' });
    }

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        volunteerId: volunteer.id
      }
    });

    if (!task) {
      return res.status(404).json({ success: false, error: 'Задача не найдена' });
    }

    if (task.status === 'completed') {
      return res.status(400).json({ success: false, error: 'Задача уже завершена' });
    }

    await prisma.task.update({
      where: { id: taskId },
      data: { status: 'completed' }
    });

    res.json({ success: true, message: 'Задача завершена' });
  } catch (error) {
    console.error('Ошибка завершения задачи:', error);
    res.status(500).json({ success: false, error: 'Ошибка при завершении задачи' });
  }
};

const getMyActiveTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const volunteer = await prisma.volunteer.findUnique({
      where: { userId: userId }
    });

    if (!volunteer) {
      return res.status(404).json({ success: false, error: 'Волонтёр не найден' });
    }

    const tasks = await prisma.task.findMany({
      where: {
        volunteerId: volunteer.id,
        status: 'active'
      },
      include: { shelter: true },
      orderBy: { isUrgent: 'desc' }
    });

    const formattedTasks = tasks.map(task => ({
      id: task.id,
      title: task.title,
      shelter: task.shelter?.orgName || 'Приют',
      datetime: task.date ? (task.timeFrom ? `${task.date}, ${task.timeFrom}` : task.date) : null,
      status: 'В работе',
      contactName: task.contactName,
      contactPhone: task.contactPhone
    }));

    res.json({ success: true, data: formattedTasks });
  } catch (error) {
    console.error('Ошибка получения активных задач:', error);
    res.status(500).json({ success: false, error: 'Ошибка при получении задач' });
  }
};

const getMyTaskHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const volunteer = await prisma.volunteer.findUnique({
      where: { userId: userId }
    });

    if (!volunteer) {
      return res.status(404).json({ success: false, error: 'Волонтёр не найден' });
    }

    const completedTasks = await prisma.task.findMany({
      where: {
        volunteerId: volunteer.id,
        status: 'completed'
      },
      include: { shelter: true },
      orderBy: { updatedAt: 'desc' }
    });

    const history = completedTasks.map(task => ({
      id: task.id,
      title: task.title,
      shelter: task.shelter?.orgName || 'Приют',
      date: task.updatedAt.toISOString().split('T')[0]
    }));

    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Ошибка получения истории:', error);
    res.status(500).json({ success: false, error: 'Ошибка при получении истории' });
  }
};

const getMyCreatedTasks = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Не авторизован' });
    }
    
    const tasks = await prisma.task.findMany({
      where: { createdById: userId },
      include: { shelter: true },
      orderBy: { createdAt: 'desc' }
    });
    const transformed = tasks.map(transformTask);
    res.json(transformed);
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ error: error.message });
  }
};

const getShelterTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const curator = await prisma.curator.findUnique({
      where: { userId: userId }
    });
    
    if (!curator) {
      return res.status(403).json({ error: 'Вы не куратор' });
    }
    
    const tasks = await prisma.task.findMany({
      where: { shelterId: curator.shelterId },
      include: { shelter: true, volunteer: { include: { user: true } } },
      orderBy: { createdAt: 'desc' }
    });
    
    const transformed = tasks.map(transformTask);
    res.json(transformed);
  } catch (error) {
    console.error('Ошибка получения задач приюта:', error);
    res.status(500).json({ error: 'Ошибка получения списка' });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  getTasksByModerationStatus,
  getAllTasksAdmin,
  approveTask,
  rejectTask,
  createTask,
  updateTask,
  deleteTask,
  takeTask,
  completeTask,
  getMyActiveTasks,
  getMyTaskHistory,
  getMyCreatedTasks,
  getShelterTasks
};