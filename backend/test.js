const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function test() {
  try {
    const user = await prisma.user.create({
      data: {
        phone: "+79991112233",
        password: await bcrypt.hash("123456", 10),
        fullName: "Тест Тестов",
        city: "Москва"
      }
    });
    console.log("Пользователь создан:", user);
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

test();