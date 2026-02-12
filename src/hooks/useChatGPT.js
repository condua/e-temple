import { useState, useCallback, useRef } from "react";

const useChatGPT = (apiKey) => {
  // Lưu trữ lịch sử chat
  const [messages, setMessages] = useState([]);

  // Trạng thái đang xử lý (loading/typing)
  const [isTyping, setIsTyping] = useState(false);

  // Trạng thái lỗi
  const [error, setError] = useState(null);

  // Dùng useRef để giữ giá trị tin nhắn đang stream mà không gây re-render liên tục
  const streamContent = useRef("");

  const sendMessage = useCallback(
    async (content, systemPrompt = "You are a helpful assistant.") => {
      setIsTyping(true);
      setError(null);
      streamContent.current = "";

      // 1. Thêm tin nhắn của User vào UI ngay lập tức
      const userMessage = { role: "user", content };

      // Tạo context mới bao gồm tin nhắn cũ + tin nhắn mới
      const newHistory = [...messages, userMessage];
      setMessages(newHistory);

      try {
        // 2. Gọi API OpenAI
        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo", // Hoặc 'gpt-4'
              messages: [
                { role: "system", content: systemPrompt },
                ...newHistory, // Gửi kèm lịch sử để bot nhớ ngữ cảnh
              ],
              stream: true, // QUAN TRỌNG: Bật chế độ stream
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`OpenAI API Error: ${response.statusText}`);
        }

        // 3. Xử lý Stream dữ liệu trả về
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // Thêm một tin nhắn rỗng của Assistant vào state để chuẩn bị hứng dữ liệu
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          // Parse từng dòng dữ liệu từ stream
          const parsedLines = lines
            .map((line) => line.replace(/^data: /, "").trim()) // Loại bỏ prefix "data: "
            .filter((line) => line !== "" && line !== "[DONE]") // Loại bỏ dòng trống và dòng kết thúc
            .map((line) => {
              try {
                return JSON.parse(line);
              } catch (e) {
                return null;
              }
            })
            .filter(Boolean);

          // Cộng dồn text và update UI
          for (const parsed of parsedLines) {
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              streamContent.current += content;

              // Update tin nhắn cuối cùng (của assistant) với nội dung mới nhất
              setMessages((prev) => {
                const updatedMessages = [...prev];
                const lastMsgIndex = updatedMessages.length - 1;
                updatedMessages[lastMsgIndex] = {
                  ...updatedMessages[lastMsgIndex],
                  content: streamContent.current,
                };
                return updatedMessages;
              });
            }
          }
        }
      } catch (err) {
        setError(err.message);
        console.error("Chat Error:", err);
      } finally {
        setIsTyping(false);
      }
    },
    [apiKey, messages],
  ); // Dependencies

  // Hàm xóa lịch sử chat
  const clearChat = () => setMessages([]);

  return {
    messages,
    sendMessage,
    isTyping,
    error,
    clearChat,
  };
};

export default useChatGPT;
