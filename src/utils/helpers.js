// Cấu hình URL server của bạn (Vercel)
const SERVER_URL = "https://e-temple-backend.vercel.app/api/chat";

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

  // 2. Tạo Prompt (Gộp system và user prompt gửi lên server)
  const fullPrompt = `Bạn là một thầy đồ nho nhã, uyên bác. Hãy viết một lời khấn nguyện ngắn gọn (dưới 50 từ), súc tích, văn phong trang trọng, cổ kính cho năm mới Bính Ngọ 2026 cho thí chủ tên là ${name}, sinh năm ${birthYear} (${age} tuổi). Cầu mong về: ${topic}.`;

  try {
    // 3. Gọi API lên Server Node.js của bạn thay vì gọi trực tiếp OpenAI
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: fullPrompt, // Key này phải khớp với req.body.message ở server Node.js
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.reply) throw new Error("API Server Error");

    const aiText = data.reply.trim();

    // 4. Xử lý format
    return formatFirstLetter(aiText);
  } catch (error) {
    console.error("Lỗi gọi Server API, dùng lời khấn mặc định:", error);

    // --- FALLBACK (Dự phòng khi API lỗi) ---
    let defaultText = "";
    if (type === "health") {
      defaultText = `Kính thưa thần linh, thí chủ ${name}, sinh năm ${birthYear}. Năm Bính Ngọ 2026, cầu mong gia đạo bình an, sức khỏe dồi dào như mãnh mã.`;
    } else if (type === "career") {
      defaultText = `Thí chủ ${name}, ${age} tuổi. Năm Bính Ngọ cầu mong đường công danh phi nước đại, mã đáo thành công.`;
    } else {
      defaultText = `Con là ${name}, xin rũ bỏ muộn phiền. Nguyện năm mới tâm an, vạn sự tùy duyên.`;
    }

    return formatFirstLetter(defaultText);
  }
};

// Hàm phụ trợ giữ nguyên
const formatFirstLetter = (text) => {
  if (!text) return "";
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
