import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const QUICK_REPLIES = ["Я выезжаю", "Я на месте", "Подтвердить"];

export default function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  useEffect(() => {
    if (chatId && chats.length > 0) {
      const chat = chats.find(c => c.id === parseInt(chatId));
      if (chat) {
        setSelectedChat(chat);
      }
    }
  }, [chatId, chats]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChats = async () => {
    try {
      const response = await api.getMyChats();
      setChats(response.data || []);
    } catch (error) {
      console.error("Ошибка загрузки чатов:", error);
    }
  };

  const loadMessages = async (chatId) => {
    setLoading(true);
    try {
      const response = await api.getChatMessages(chatId);
      setMessages(response.data || []);
    } catch (error) {
      console.error("Ошибка загрузки сообщений:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim() || !selectedChat || sending) return;
    
    setSending(true);
    try {
      await api.sendMessage(selectedChat.id, text);
      await loadMessages(selectedChat.id);
      await loadChats();
      setInputValue("");
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const selectChat = (chat) => {
    setSelectedChat(chat);
    navigate(`/chat/${chat.id}`);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f1]">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div
          className="bg-white rounded-2xl shadow-sm overflow-hidden flex"
          style={{ height: "calc(100vh - 120px)" }}
        >
          {/* Sidebar — список чатов */}
          <div className="w-72 border-r border-gray-100 flex flex-col shrink-0">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-extrabold text-[#212121]">Сообщения</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {chats.length === 0 ? (
                <div className="px-5 py-8 text-center text-[#9e9e9e] text-sm">
                  Нет диалогов
                </div>
              ) : (
                chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => selectChat(chat)}
                    className={`w-full text-left px-5 py-4 flex items-center gap-3 hover:bg-[#f5f5f5] transition-colors border-l-2 ${
                      selectedChat?.id === chat.id
                        ? "bg-[#f0f7f1] border-[#3a7d44]"
                        : "border-transparent"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center text-lg shrink-0">
                      {chat.role === "curator" ? "🏠" : "👤"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-bold text-[#212121] truncate">{chat.name}</span>
                        <span className="text-xs text-[#9e9e9e] shrink-0 ml-2">{chat.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-[#9e9e9e] truncate">{chat.lastMessage}</p>
                        {chat.unread > 0 && (
                          <span className="ml-2 w-5 h-5 rounded-full bg-[#3a7d44] text-white text-xs flex items-center justify-center shrink-0 font-bold">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            {selectedChat ? (
              <>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#e8f5e9] flex items-center justify-center text-base">
                      {selectedChat.role === "curator" ? "🏠" : "👤"}
                    </div>
                    <span className="font-bold text-[#212121]">{selectedChat.name}</span>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                    <InfoIcon />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
                  {loading ? (
                    <div className="text-center text-gray-400">Загрузка...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-400">Нет сообщений</div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            msg.from === "me"
                              ? "bg-[#3a7d44] text-white rounded-br-md"
                              : "bg-[#f5f5f5] text-[#212121] rounded-bl-md"
                          }`}
                        >
                          <p>{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.from === "me" ? "text-green-200 text-right" : "text-[#9e9e9e]"}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="px-6 pt-2 pb-1 flex gap-2 shrink-0">
                  {QUICK_REPLIES.map((qr) => (
                    <button
                      key={qr}
                      onClick={() => sendMessage(qr)}
                      disabled={sending}
                      className="px-4 py-1.5 rounded-full border border-gray-300 text-sm text-[#616161] hover:border-[#3a7d44] hover:text-[#3a7d44] transition-colors disabled:opacity-50"
                    >
                      {qr}
                    </button>
                  ))}
                </div>

                <div className="px-6 py-4 border-t border-gray-100 shrink-0">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Введите сообщение..."
                      disabled={sending}
                      className="flex-1 bg-[#f5f5f5] rounded-xl px-4 py-2.5 text-sm text-[#212121] placeholder-[#9e9e9e] outline-none focus:ring-2 focus:ring-[#3a7d44] focus:ring-opacity-30 transition-all disabled:opacity-50"
                    />
                    <button
                      onClick={() => sendMessage(inputValue)}
                      disabled={sending || !inputValue.trim()}
                      className="w-10 h-10 rounded-xl bg-[#3a7d44] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white hover:bg-[#5a9e66] transition-colors shrink-0"
                    >
                      <SendIcon />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#9e9e9e] text-sm">
                Выберите диалог
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}