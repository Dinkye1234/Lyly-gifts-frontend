import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Sparkles, User, Bot, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AIAssistant = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  // 1. Хэрэглэгчийн ID-г token-оос салгаж авах
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(
          window.atob(
            token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"),
          ),
        );
        setUserId(payload.id); // payload.id эсвэл таны backend-ээс ирдэг user ID
      } catch (e) {
        console.error("Token error", e);
      }
    }
  }, []);

  // 2. Messages төлөвийг userId бэлэн болсны дараа ачаалах
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Сайн байна уу? Намайг Lily AI гэдэг. Танд юугаар туслах уу?",
      products: [],
    },
  ]);

  // userId өөрчлөгдөх бүрт тухайн хэрэглэгчийн чатыг localStorage-аас унших
  useEffect(() => {
    if (userId) {
      const savedChat = localStorage.getItem(`lily_chat_history_${userId}`);
      if (savedChat) {
        setMessages(JSON.parse(savedChat));
      } else {
        // Шинэ хэрэглэгч бол чатыг Reset хийх
        setMessages([
          {
            role: "assistant",
            content:
              "Сайн байна уу? Намайг Lily AI гэдэг. Танд юугаар туслах уу?",
            products: [],
          },
        ]);
      }
    }
  }, [userId]);

  // 3. Messages өөрчлөгдөх бүрт тухайн хэрэглэгчийн ID-гаар хадгалах
  useEffect(() => {
    if (userId) {
      localStorage.setItem(
        `lily_chat_history_${userId}`,
        JSON.stringify(messages),
      );
    }
    scrollToBottom();
  }, [messages, userId]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const clearChat = () => {
    if (window.confirm("Чатны түүхийг устгах уу?")) {
      const initialMsg = [
        {
          role: "assistant",
          content:
            "Сайн байна уу? Намайг Lily AI гэдэг. Танд юугаар туслах уу?",
          products: [],
        },
      ];
      setMessages(initialMsg);
      if (userId) {
        localStorage.removeItem(`lily_chat_history_${userId}`);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/ai/chat", {
        messages: updatedMessages,
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.message,
          products: res.data.products || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Алдаа гарлаа.", products: [] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // UI хэсэг (таны өмнөх код хэвээрээ байна)
  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col items-center bg-gray-50 dark:bg-gray-950 overflow-hidden mt-[80px]">
      <div className="w-full max-w-4xl h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl relative border-x border-gray-100 dark:border-gray-800">
        <div className="bg-white dark:bg-gray-800 p-4 border-b flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="font-bold text-gray-700 dark:text-white text-sm">
              Lily AI Туслах
            </h2>
          </div>
          <button
            onClick={clearChat}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#f9fafb] dark:bg-gray-900/50"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl flex flex-col space-y-2 ${msg.role === "user" ? "bg-purple-600 text-white rounded-tr-none" : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none border"}`}
              >
                <div className="flex items-start space-x-2">
                  {msg.role === "assistant" && (
                    <Bot className="h-5 w-5 text-purple-500 mt-1" />
                  )}
                  <div className="text-sm whitespace-pre-wrap">
                    {msg.content}
                  </div>
                  {msg.role === "user" && <User className="h-5 w-5 mt-1" />}
                </div>
                {msg.products && msg.products.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {msg.products.map((p) => (
                      <div
                        key={p._id}
                        className="border rounded-xl p-2 cursor-pointer hover:shadow bg-white dark:bg-gray-700 transition-all"
                        onClick={() =>
                          navigate(`/product/${p._id}`, {
                            state: { fromAI: true },
                          })
                        }
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-24 w-full object-cover rounded"
                        />
                        <p className="text-[10px] font-bold mt-1 text-gray-800 dark:text-white line-clamp-1">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-purple-600 font-bold">
                          {Number(p.price).toLocaleString()}₮
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-2 text-purple-500 text-xs animate-pulse">
              <Bot className="h-4 w-4" />
              <span>Lily хариу бичиж байна...</span>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-white dark:bg-gray-900">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-2 px-4 shadow-inner">
            <input
              type="text"
              placeholder="Асуултаа бичнэ үү..."
              className="w-full bg-transparent outline-none text-sm dark:text-white py-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className={`p-2 rounded-lg transition-all ${input.trim() ? "bg-purple-600 text-white shadow-md" : "bg-gray-300 text-gray-500"}`}
              disabled={loading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
