export const simulateAIPrayer = async (type, name, age) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let response = "";
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - age;

      if (type === "health") {
        response = `K ính thưa thần linh, tín chủ ${name}, sinh năm ${birthYear}. Năm Bính Ngọ 2026, cầu mong gia đạo bình an, sức khỏe dồi dào như mãnh mã, tai qua nạn khỏi.`;
      } else if (type === "career") {
        response = `T ín chủ ${name}, ${age} tuổi. Năm Bính Ngọ cầu mong đường công danh phi nước đại, học hành tấn tới, thi cử đỗ đạt, mã đáo thành công.`;
      } else {
        response = `C on là ${name}, xin rũ bỏ những muộn phiền. Nguyện năm mới tâm hồn thanh thản, vạn sự tùy duyên, lòng an nhiên tự tại giữa dòng đời vội vã.`;
      }
      resolve(response);
    }, 1500);
  });
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
        explanation: `Chữ ${word} ứng với vận mệnh năm Bính Ngọ của tín chủ ${name}, mang ý khí thế và hanh thông.`,
        poem:
          poems[word] ||
          "Xuân sang hạnh phúc bình an đến / Tết về lộc biếc nở hoa thơm.",
      });
    }, 2000);
  });
};
