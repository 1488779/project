const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Заполняем базу...');

  await prisma.task.deleteMany();
  await prisma.animal.deleteMany();

  await prisma.animal.createMany({
    data: [
      { name: "Рекс", age: "3 года", type: "dog" },
      { name: "Мурка", age: "1 год", type: "cat" },
      { name: "Бобик", age: "5 лет", type: "dog" },
      { name: "Снежок", age: "2 года", type: "cat" },
    ],
  });

  await prisma.task.createMany({
    data: [
      { title: "Доставить 20кг корма", shelter: "Добрые руки", distance: 2.3, icon: "delivery" },
      { title: "Выгулять 3-х собак", shelter: "Счастливый хвост", distance: 4.1, icon: "walking" },
      { title: "Ремонт крыши вольера", shelter: "Новый дом", distance: 5.8, icon: "fix" },
    ],
  });

  console.log('Готово!');
}

main().catch(console.error).finally(() => prisma.$disconnect());