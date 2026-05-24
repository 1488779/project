const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getShelters(req, res) {
  try {
    const shelters = await prisma.shelter.findMany({
      select: {
        id: true,
        orgName: true,
        address: true,
        logo: true,
        description: true,
      }
    });
    res.json({ success: true, data: shelters });
  } catch (error) {
    console.error('Ошибка получения приютов:', error);
    res.status(500).json({ success: false, error: 'Ошибка получения списка приютов' });
  }
}

module.exports = {
  getShelters
};