// Cấu hình API Key (Lưu ý: Nên để trong biến môi trường env nếu deploy thật)
const API_KEY = "sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
export const simulateAIPrayer = async (type, name, age) => {
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - age;

  // 1. Xác định chủ đề cầu nguyện
  let topic = "";
  if (type === "health") {
    topic = "sức khỏe dồi dào, gia đạo bình an, tai qua nạn khỏi";
  } else if (type === "career") {
    topic = "công danh thăng tiến, học hành đỗ đạt, mã đáo thành công";
  } else {
    topic = "tâm hồn thanh thản, an nhiên tự tại, vạn sự tùy duyên";
  }

  // 2. Tạo Prompt (Câu lệnh) cho ChatGPT
  const systemPrompt =
    "Bạn là một thầy đồ nho nhã, uyên bác. Hãy viết một lời khấn nguyện ngắn gọn (dưới 50 từ), súc tích, văn phong trang trọng, cổ kính cho năm mới Bính Ngọ 2026.";
  const userPrompt = `Viết lời khấn cho thí chủ tên là ${name}, sinh năm ${birthYear} (${age} tuổi). Cầu mong về: ${topic}.`;

  try {
    // 3. Gọi API OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Hoặc "gpt-4o-mini" cho rẻ và nhanh
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7, // Độ sáng tạo vừa phải
        max_tokens: 100,
      }),
    });

    const data = await response.json();

    // Nếu API lỗi hoặc hết quota, ném lỗi để xuống phần catch dùng fallback
    if (!response.ok || !data.choices) throw new Error("API Error");

    const aiText = data.choices[0].message.content.trim();

    // 4. Xử lý format: Tách chữ cái đầu tiên (Quan trọng)
    // Ví dụ: "Kính thưa" -> "K ính thưa"
    return formatFirstLetter(aiText);
  } catch (error) {
    console.error("Lỗi gọi AI, dùng lời khấn mặc định:", error);

    // --- FALLBACK (Dự phòng khi API lỗi/hết tiền) ---
    // Vẫn giữ logic cũ để app không bị chết
    let defaultText = "";
    if (type === "health") {
      defaultText = `Kính thưa thần linh, thí chủ ${name}, sinh năm ${birthYear}. Năm Bính Ngọ 2026, cầu mong gia đạo bình an, sức khỏe dồi dào như mãnh mã.`;
    } else if (type === "career") {
      defaultText = `Thí chủ ${name}, ${age} tuổi. Năm Bính Ngọ cầu mong đường công danh phi nước đại, mã đáo thành công.`;
    } else {
      defaultText = `Con là ${name}, xin rũ bỏ muộn phiền. Nguyện năm mới tâm an, vạn sự tùy duyên.`;
    }

    // Vẫn áp dụng format chữ đầu cho nội dung mặc định
    return formatFirstLetter(defaultText);
  }
};

// Hàm phụ trợ để tách chữ cái đầu
const formatFirstLetter = (text) => {
  if (!text) return "";
  // Lấy chữ cái đầu, viết hoa + dấu cách + phần còn lại của chuỗi
  const firstChar = text.charAt(0).toUpperCase();
  const restOfString = text.slice(1);
  return `${firstChar} ${restOfString}`;
};

export const simulateAICalligraphy = async (word, name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const poems = {
        Phúc: "Phúc như Đông Hải trường lưu thủy / Thọ tỷ Nam Sơn bất lão tùng.",
        Lộc: "Đa lộc đa tài đa phú quý / Đắc thời đắc lợi đắc nhân tâm.",
        Thọ: "Trời thêm tuổi mới người thêm thọ / Xuân khắp dương gian phúc khắp nhà.",
        An: "An khang thịnh vượng niên niên lạc / Vạn sự như ý đại cát tường.",
        Nhẫn: "Nhẫn một chút sóng yên biển lặng / Lùi một bước biển rộng trời cao.",
        Tâm: "Tâm sáng đức trong vạn sự thành / Lòng ngay dạ thẳng phúc lai sinh.",
        Đức: "Tiên tổ trồng cây cây có đức / Cháu con hái quả quả dâng đời.",
        Trí: "Trí tuệ khai thông vạn sự nhàn / Học hành tấn tới rạng danh vang.",
        Mã: "Mã đáo thành công xuân ý nguyện / Kỳ khai đắc thắng phúc lâm môn.",
      };
      resolve({
        explanation: `Chữ ${word} ứng với vận mệnh năm Bính Ngọ của thí chủ ${name}, mang ý khí thế và hanh thông.`,
        poem:
          poems[word] ||
          "Xuân sang hạnh phúc bình an đến / Tết về lộc biếc nở hoa thơm.",
      });
    }, 2000);
  });
};
