import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Sparkles, User, Bot } from "lucide-react";

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Сайн байна уу? Намайг Lily AI гэдэг. Танд юугаар туслах уу?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Зөвхөн чат дотор гүйлгэх функц
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/ai/chat", {
        messages: [...messages, userMessage],
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.message },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Алдаа гарлаа." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* ЗАСВАР 1: h-[calc(100vh-80px)] 
       - Энэ нь дэлгэцийн бүтэн өндрөөс Header-ийн өндрийг (жишээ нь 80px) хасаж тооцно.
       - overflow-hidden: Энэ контейнер өөрөө дээшээ доошоо гүйхгүй.
    */
    <div className="w-full h-[calc(100vh-80px)] flex flex-col items-center bg-gray-50 dark:bg-gray-950 overflow-hidden mt-[80px]">
      {/* ЗАСВАР 2: Чатны хайрцаг 
         - h-full: Дээрх тооцоолсон зайд бүрэн багтана.
      */}
      <div className="w-full max-w-4xl h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl relative border-x border-gray-100 dark:border-gray-800">
        {/* LILY HEADER (Чат доторх жижиг гарчиг) */}
        <div className="bg-white dark:bg-gray-800 p-4 border-b flex items-center space-x-3 shrink-0">
          <div className="bg-purple-100 p-2 rounded-full">
            <Sparkles className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="font-bold text-gray-700 dark:text-white text-sm">
            Lily AI Туслах
          </h2>
        </div>

        {/* MESSAGES AREA: Зөвхөн энэ хэсэг л scroll хийгдэнэ */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#f9fafb] dark:bg-gray-900/50 custom-scrollbar"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl flex items-start space-x-3 ${
                  msg.role === "user"
                    ? "bg-purple-600 text-white rounded-tr-none shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm"
                }`}
              >
                {msg.role === "assistant" && (
                  <Bot className="h-5 w-5 mt-1 shrink-0 text-purple-500" />
                )}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <User className="h-5 w-5 mt-1 shrink-0 opacity-80" />
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-2 text-purple-500 text-xs p-2 animate-pulse">
              <span>Lily хариу бичиж байна...</span>
            </div>
          )}
        </div>

        {/* INPUT AREA: Дэлгэцийн хамгийн доор (Footer-ийн яг дээр) түгжигдэнэ */}
        <div className="p-4 border-t bg-white dark:bg-gray-900 shrink-0">
          <div className="relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700">
            <input
              type="text"
              placeholder="Асуултаа бичнэ үү..."
              className="w-full p-2 bg-transparent border-none focus:ring-0 text-sm dark:text-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all active:scale-95 shadow-md"
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
