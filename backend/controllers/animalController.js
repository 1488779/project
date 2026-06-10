const { PrismaClient } = require('@prisma/client');
const { createNotification } = require('./notificationController');
const prisma = new PrismaClient();

const transformAnimal = (animal) => {
  const health = [];
  if (animal.isVaccinated) health.push('Вакцинирован');
  if (animal.isSterilized) health.push('Стерилизован');
  if (animal.isChipped) health.push('Чипирован');

  return {
    id: animal.id,
    name: animal.name,
    age: animal.age,
    type: animal.type,
    description: animal.description,
    moderationStatus: animal.moderationStatus,
    createdAt: animal.createdAt,
    updatedAt: animal.updatedAt,
    adopted: animal.adopted,  

    extraData: {
      breed: animal.breed,
      color: animal.color,
      weight: animal.weight,
      specialConditions: animal.specialConditions,
      photos: animal.photos,
      health: health,
      shelter: animal.shelter?.orgName || null,
      address: animal.shelter?.address || null,
      emoji: animal.type === 'Собака' ? '🐕' : animal.type === 'Кошка' ? '🐱' : '🐾'
    }
  };
};

const getAllAnimals = async (req, res) => {
  try {
    const animals = await prisma.animal.findMany({
      where: { moderationStatus: 'approved' },
      include: { shelter: true },
      orderBy: { createdAt: 'desc' }
    });

    const transformed = animals.map(transformAnimal);
    res.json(transformed);
  } catch (error) {
    console.error('Ошибка GET /api/animals:', error);
    res.status(500).json({ error: 'Ошибка получения списка животных' });
  }
};

const getAnimalById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const animal = await prisma.animal.findUnique({ 
      where: { id },
      include: { shelter: true, createdBy: true }
    });
    
    if (!animal) {
      return res.status(404).json({ error: 'Животное не найдено' });
    }

    const transformed = transformAnimal(animal);
    res.json(transformed);
  } catch (error) {
    console.error('Ошибка GET /api/animals/:id:', error);
    res.status(500).json({ error: 'Ошибка получения данных' });
  }
};

const getAllAnimalsAdmin = async (req, res) => {
  try {
    const animals = await prisma.animal.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(animals);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения списка' });
  }
};


const createAnimal = async (req, res) => {
  try {
    const { 
      name, age, type, breed, color, description, weight,
      isVaccinated, isSterilized, isChipped, specialConditions,
      photos, createdById, shelterId
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Кличка обязательна' });
    }
    
    const animal = await prisma.animal.create({
      data: {
        name: name.trim(),
        age: age || 'не указан',
        type: type || 'Другое',
        breed: breed || null,
        color: color || null,
        description: description || null,
        weight: weight ? parseFloat(weight) : null,
        isVaccinated: isVaccinated || false,
        isSterilized: isSterilized || false,
        isChipped: isChipped || false,
        specialConditions: specialConditions || null,
        photos: photos || [],
        moderationStatus: 'pending',
        createdById: createdById || null,
        shelterId: shelterId || null
      }
    });
    
    res.status(201).json(animal);
  } catch (error) {
    console.error('Ошибка POST /api/animals:', error);
    res.status(500).json({ error: 'Ошибка создания животного' });
  }
};

const updateAnimal = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { 
      name, age, type, breed, color, description, weight,
      isVaccinated, isSterilized, isChipped, specialConditions,
      photos, shelterId
    } = req.body;
    
    const existingAnimal = await prisma.animal.findUnique({ where: { id } });
    if (!existingAnimal) {
      return res.status(404).json({ error: 'Животное не найдено' });
    }
    
    const animal = await prisma.animal.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : existingAnimal.name,
        age: age !== undefined ? age : existingAnimal.age,
        type: type !== undefined ? type : existingAnimal.type,
        breed: breed !== undefined ? breed : existingAnimal.breed,
        color: color !== undefined ? color : existingAnimal.color,
        description: description !== undefined ? description : existingAnimal.description,
        weight: weight !== undefined ? (weight ? parseFloat(weight) : null) : existingAnimal.weight,
        isVaccinated: isVaccinated !== undefined ? isVaccinated : existingAnimal.isVaccinated,
        isSterilized: isSterilized !== undefined ? isSterilized : existingAnimal.isSterilized,
        isChipped: isChipped !== undefined ? isChipped : existingAnimal.isChipped,
        specialConditions: specialConditions !== undefined ? specialConditions : existingAnimal.specialConditions,
        photos: photos !== undefined ? photos : existingAnimal.photos,
        shelterId: shelterId !== undefined ? shelterId : existingAnimal.shelterId
      }
    });
    
    res.json(animal);
  } catch (error) {
    console.error('Ошибка PUT /api/animals/:id:', error);
    res.status(500).json({ error: 'Ошибка обновления' });
  }
};

const deleteAnimal = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const existingAnimal = await prisma.animal.findUnique({ where: { id } });
    if (!existingAnimal) {
      return res.status(404).json({ error: 'Животное не найдено' });
    }
    
    await prisma.animal.delete({ where: { id } });
    res.json({ message: 'Животное удалено' });
  } catch (error) {
    console.error('Ошибка DELETE /api/animals/:id:', error);
    res.status(500).json({ error: 'Ошибка удаления' });
  }
};

const getAnimalsByModerationStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Неверный статус' });
    }
    
    const animals = await prisma.animal.findMany({
      where: { moderationStatus: status },
      orderBy: { createdAt: 'desc' }
    });
    res.json(animals);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения списка' });
  }
};

const approveAnimal = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const animal = await prisma.animal.update({
      where: { id },
      data: { moderationStatus: 'approved' }
    });
    
    await createNotification(
      animal.createdById,
      'Животное одобрено',
      `Ваша анкета "${animal.name}" прошла модерацию и опубликована`,
      'animal_approved',
      `/animals/${animal.id}`
    );
    
    res.json({ message: 'Животное одобрено', animal });
  } catch (error) {
    console.error('Ошибка одобрения:', error);
    res.status(500).json({ error: 'Ошибка одобрения' });
  }
};

const rejectAnimal = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { reason } = req.body;
    const animal = await prisma.animal.update({
      where: { id },
      data: { moderationStatus: 'rejected' }
    });
    
    await createNotification(
      animal.createdById,
      'Животное отклонено',
      `Ваша анкета "${animal.name}" не прошла модерацию${reason ? `: ${reason}` : ''}`,
      'animal_rejected',
      `/animals/${animal.id}`
    );
    
    res.json({ message: 'Животное отклонено', animal, reason: reason || null });
  } catch (error) {
    console.error('Ошибка отклонения:', error);
    res.status(500).json({ error: 'Ошибка отклонения' });
  }
};

const getSimilarAnimals = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const animal = await prisma.animal.findUnique({ where: { id } });
    if (!animal) {
      return res.status(404).json({ error: 'Животное не найдено' });
    }
    
    const similar = await prisma.animal.findMany({
      where: {
        id: { not: id },
        type: animal.type,
        moderationStatus: 'approved'
      },
      take: 4,
      orderBy: { createdAt: 'desc' }
    });
    res.json(similar);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения похожих' });
  }
};

const adoptAnimal = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user.id;
    
    const animal = await prisma.animal.findUnique({
      where: { id },
      include: { 
        shelter: { 
          include: { curators: { include: { user: true } } }
        }
      }
    });
    
    if (!animal) {
      return res.status(404).json({ error: 'Животное не найдено' });
    }
    
    if (animal.adopted) {
      return res.status(400).json({ error: 'Животное уже усыновлено' });
    }
    
    const updated = await prisma.animal.update({
      where: { id },
      data: {
        adopted: true,
        adoptedAt: new Date(),
        adoptedBy: userId
      }
    });

    if (animal.shelter?.curators?.length > 0) {
      for (const curator of animal.shelter.curators) {
        await createNotification(
          curator.userId,
          'Животное обрело дом',
          `Питомец "${animal.name}" был усыновлён`,
          'animal_adopted',
          `/animals/${animal.id}`
        );
      }
    }
    
    res.json({ success: true, message: 'Животное усыновлено', data: updated });
  } catch (error) {
    console.error('Ошибка усыновления:', error);
    res.status(500).json({ error: 'Ошибка усыновления' });
  }
};

module.exports = {
  getAllAnimals,
  getAllAnimalsAdmin,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  getAnimalsByModerationStatus,
  approveAnimal,
  rejectAnimal,
  getSimilarAnimals,
  adoptAnimal
};