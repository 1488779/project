const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Добавляем тестовые данные...');

  let shelter = await prisma.shelter.findFirst({
    where: { orgName: 'Добрые руки' }
  });
  
  if (!shelter) {
    shelter = await prisma.shelter.create({
      data: {
        orgName: 'Добрые руки',
        description: 'Приют для бездомных животных в Екатеринбурге',
        phone: '+79991234567',
        email: 'dobrye.ruki@example.com',
        address: 'г. Екатеринбург, ул. Мира, 28',
        logo: null
      }
    });
    console.log('Приют создан');
  } else {
    console.log('Приют уже существует');
  }

  const users = [
    { email: 'volunteer@test.com', password: '1234', fullName: 'Иван Волонтёров', city: 'Екатеринбург', role: 'volunteer' },
    { email: 'curator@test.com', password: '1234', fullName: 'Мария Кураторова', city: 'Екатеринбург', role: 'curator' },
    { email: 'owner@test.com', password: '1234', fullName: 'Алексей Владельцев', city: 'Екатеринбург', role: 'owner' }
  ];

  for (const u of users) {
    let user = await prisma.user.findUnique({
      where: { email: u.email }
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: u.email,
          password: await bcrypt.hash(u.password, 10),
          fullName: u.fullName,
          city: u.city,
          role: u.role
        }
      });
      console.log(`Пользователь ${u.email} создан`);
    } else {
      console.log(`Пользователь ${u.email} уже существует`);
      continue;
    }

    if (u.role === 'volunteer') {
      const existing = await prisma.volunteer.findUnique({
        where: { userId: user.id }
      });
      if (!existing) {
        await prisma.volunteer.create({
          data: {
            userId: user.id,
            skills: ['Выгул', 'Транспорт', 'Фото'],
            considersFoster: true,
            maxFosterDays: 14,
            districts: ['Центральный', 'Юго-Западный'],
            availableTime: 'Выходные, будни после 18:00'
          }
        });
        console.log(`Волонтёр создан для ${u.email}`);
      }
    } else if (u.role === 'curator') {
      const existing = await prisma.curator.findUnique({
        where: { userId: user.id }
      });
      if (!existing) {
        await prisma.curator.create({
          data: {
            userId: user.id,
            shelterId: shelter.id
          }
        });
        console.log(`Куратор создан для ${u.email}`);
      }
    } else if (u.role === 'owner') {
      const existing = await prisma.owner.findUnique({
        where: { userId: user.id }
      });
      if (!existing) {
        await prisma.owner.create({
          data: {
            userId: user.id,
            contactPhone: '+79998887766'
          }
        });
        console.log(`Владелец создан для ${u.email}`);
      }
    }
  }

  const animals = [
    {
      name: 'Рекс',
      age: '3 года',
      type: 'Собака',
      breed: 'Золотистый ретривер',
      color: 'Золотистый',
      description: 'Очень дружелюбный и активный пёс. Любит гулять и играть с мячиком.',
      weight: 28,
      isVaccinated: true,
      isSterilized: true,
      isChipped: true,
      moderationStatus: 'approved',
      shelterId: shelter.id
    },
    {
      name: 'Мурка',
      age: '1 год',
      type: 'Кошка',
      breed: 'Британская короткошерстная',
      color: 'Серебристый',
      description: 'Ласковая и спокойная кошка. Приучена к лотку.',
      weight: 4,
      isVaccinated: true,
      isSterilized: true,
      isChipped: true,
      moderationStatus: 'approved',
      shelterId: shelter.id
    },
    {
      name: 'Бобик',
      age: '5 лет',
      type: 'Собака',
      breed: 'Дворняга',
      color: 'Чёрно-белый',
      description: 'Спокойный и преданный пёс.',
      weight: 15,
      isVaccinated: true,
      isSterilized: true,
      isChipped: false,
      moderationStatus: 'approved',
      shelterId: shelter.id
    },
    {
      name: 'Снежок',
      age: '2 года',
      type: 'Кошка',
      breed: 'Персидская',
      color: 'Белый',
      description: 'Белый пушистый кот. Любит внимание и ласку.',
      weight: 5,
      isVaccinated: true,
      isSterilized: true,
      isChipped: true,
      moderationStatus: 'approved',
      shelterId: shelter.id
    },
    {
      name: 'Рыжик',
      age: '6 месяцев',
      type: 'Кошка',
      breed: 'Рыжий кот',
      color: 'Рыжий',
      description: 'Маленький рыжий котёнок. Очень игривый и ласковый.',
      weight: 2.5,
      isVaccinated: true,
      isSterilized: false,
      isChipped: false,
      moderationStatus: 'approved',
      shelterId: shelter.id
    }
  ];

  let animalsAdded = 0;
  for (const a of animals) {
    const existing = await prisma.animal.findFirst({
      where: { name: a.name, type: a.type, shelterId: a.shelterId }
    });
    if (!existing) {
      await prisma.animal.create({ data: a });
      animalsAdded++;
    }
  }
  console.log(`Добавлено ${animalsAdded} новых животных`);

  const tasks = [
    {
      title: 'Доставить 20кг корма',
      description: 'Нужно доставить 20 кг корма в приют',
      category: 'Транспорт',
      date: '2026-06-15',
      timeFrom: '10:00',
      timeTo: '12:00',
      address: 'г. Екатеринбург, ул. Мира, 28',
      skills: ['Транспорт', 'Физическая сила'],
      isUrgent: false,
      contactName: 'Мария Кураторова',
      contactRole: 'Куратор',
      contactPhone: '+79991234567',
      status: 'open',
      moderationStatus: 'approved',
      photos: [],
      shelterId: shelter.id
    },
    {
      title: 'Выгул 3-х собак',
      description: 'Выгулять собак на территории приюта',
      category: 'Выгул',
      date: '2026-06-16',
      timeFrom: '14:00',
      timeTo: '16:00',
      address: 'г. Екатеринбург, ул. Мира, 28',
      skills: ['Выгул'],
      isUrgent: false,
      contactName: 'Мария Кураторова',
      contactRole: 'Куратор',
      contactPhone: '+79991234567',
      status: 'open',
      moderationStatus: 'approved',
      photos: [],
      shelterId: shelter.id
    },
    {
      title: 'Ремонт вольера',
      description: 'Починить сломанную дверцу в вольере',
      category: 'Ремонт',
      date: '2026-06-17',
      timeFrom: '11:00',
      timeTo: '15:00',
      address: 'г. Екатеринбург, ул. Мира, 28',
      skills: ['Ремонт', 'Физическая сила'],
      isUrgent: true,
      contactName: 'Мария Кураторова',
      contactRole: 'Куратор',
      contactPhone: '+79991234567',
      status: 'open',
      moderationStatus: 'approved',
      photos: [],
      shelterId: shelter.id
    },
    {
      title: 'Помощь с уборкой',
      description: 'Помочь с уборкой территории приюта',
      category: 'Уборка',
      date: '2026-06-18',
      timeFrom: '09:00',
      timeTo: '13:00',
      address: 'г. Екатеринбург, ул. Мира, 28',
      skills: ['Уборка'],
      isUrgent: false,
      contactName: 'Мария Кураторова',
      contactRole: 'Куратор',
      contactPhone: '+79991234567',
      status: 'open',
      moderationStatus: 'approved',
      photos: [],
      shelterId: shelter.id
    }
  ];

  let tasksAdded = 0;
  for (const t of tasks) {
    const existing = await prisma.task.findFirst({
      where: { title: t.title, shelterId: t.shelterId }
    });
    if (!existing) {
      await prisma.task.create({ data: t });
      tasksAdded++;
    }
  }
  console.log(`Добавлено ${tasksAdded} новых задач`);

  console.log('\nГотово!');
  console.log('Тестовые пользователи: volunteer@test.com / 1234, curator@test.com / 1234, owner@test.com / 1234');
}

main()
  .catch(e => {
    console.error('Ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });