const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getMyChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const participants = await prisma.chatParticipant.findMany({
      where: { userId: userId },
      include: {
        chat: {
          include: {
            participants: {
              include: {
                user: {
                  select: { id: true, fullName: true, avatar: true, role: true }
                }
              }
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      }
    });

    const chats = [];
    for (const p of participants) {
      const chat = p.chat;
      const otherParticipant = chat.participants.find(p2 => p2.userId !== userId);
      const lastMessage = chat.messages[0];
      
      const unreadCount = await prisma.message.count({
        where: {
          chatId: chat.id,
          senderId: { not: userId },
          isRead: false
        }
      });
      
      chats.push({
        id: chat.id,
        name: otherParticipant?.user?.fullName || 'Пользователь',
        avatar: otherParticipant?.user?.avatar,
        role: otherParticipant?.user?.role,
        lastMessage: lastMessage?.text || 'Нет сообщений',
        time: lastMessage?.createdAt ? new Date(lastMessage.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '',
        unread: unreadCount
      });
    }

    res.json({ success: true, data: chats });
  } catch (error) {
    console.error('Ошибка получения чатов:', error);
    res.status(500).json({ success: false, error: 'Ошибка получения чатов' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const chatId = parseInt(req.params.id);
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: 'Текст сообщения обязателен' });
    }

    const participant = await prisma.chatParticipant.findUnique({
      where: {
        chatId_userId: {
          chatId: chatId,
          userId: userId
        }
      }
    });

    if (!participant) {
      return res.status(403).json({ success: false, error: 'Нет доступа к чату' });
    }

    const message = await prisma.message.create({
      data: {
        chatId: chatId,
        senderId: userId,
        text: text.trim()
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });

    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() }
    });

    const formattedMessage = {
      id: message.id,
      from: 'me',
      text: message.text,
      time: new Date(message.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };

    res.status(201).json({ success: true, data: formattedMessage });
  } catch (error) {
    console.error('Ошибка отправки сообщения:', error);
    res.status(500).json({ success: false, error: 'Ошибка отправки сообщения' });
  }
};

const createChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.body;

    if (!otherUserId || otherUserId === userId) {
      return res.status(400).json({ success: false, error: 'Неверный пользователь' });
    }

    const existingChat = await prisma.chatParticipant.findFirst({
      where: {
        userId: userId
      },
      include: {
        chat: {
          include: {
            participants: {
              where: { userId: otherUserId }
            }
          }
        }
      }
    });

    if (existingChat?.chat?.participants?.length > 0) {
      return res.json({ success: true, data: { id: existingChat.chatId } });
    }

    const chat = await prisma.chat.create({
      data: {
        participants: {
          create: [
            { userId: userId },
            { userId: otherUserId }
          ]
        }
      }
    });

    res.status(201).json({ success: true, data: { id: chat.id } });
  } catch (error) {
    console.error('Ошибка создания чата:', error);
    res.status(500).json({ success: false, error: 'Ошибка создания чата' });
  }
};

const getChatMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const chatId = parseInt(req.params.id);

    const participant = await prisma.chatParticipant.findUnique({
      where: {
        chatId_userId: {
          chatId: chatId,
          userId: userId
        }
      }
    });

    if (!participant) {
      return res.status(403).json({ success: false, error: 'Нет доступа к чату' });
    }

    const messages = await prisma.message.findMany({
      where: { chatId: chatId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            avatar: true
          }
        }
      }
    });

    await prisma.message.updateMany({
      where: {
        chatId: chatId,
        senderId: { not: userId },
        isRead: false
      },
      data: { isRead: true }
    });

    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      from: msg.senderId === userId ? 'me' : 'other',
      text: msg.text,
      time: new Date(msg.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      senderName: msg.sender.fullName
    }));

    res.json({ success: true, data: formattedMessages });
  } catch (error) {
    console.error('Ошибка получения сообщений:', error);
    res.status(500).json({ success: false, error: 'Ошибка получения сообщений' });
  }
};

module.exports = {
  getMyChats,
  getChatMessages,
  sendMessage,
  createChat
};