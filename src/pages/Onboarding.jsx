import React, { useState } from "react";

const Onboarding = ({ onComplete }) => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");

  // Lấy ngày hiện tại định dạng YYYY-MM-DD để chặn lịch
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Thêm trạng thái loading nếu cần: setIsLoading(true);

    if (name && dob) {
      // 1. Validation logic
      if (dob > today) {
        setError("Ngày sinh không được lớn hơn ngày hôm nay!");
        return;
      }

      const userData = { name, dob };

      try {
        // 2. Gửi dữ liệu lên API POST
        const response = await fetch(
          "https://e-temple-backend.vercel.app/api/users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          },
        );

        if (!response.ok) {
          // Nếu server trả về lỗi (ví dụ 500 như bạn gặp lúc nãy)
          throw new Error("Không thể lưu dữ liệu lên server!");
        }

        // 3. Nếu API thành công, tiến hành lưu LocalStorage và chuyển màn
        localStorage.setItem("temple_user_2026", JSON.stringify(userData));

        // Trả về kết quả từ API nếu cần
        const result = await response.json();
        onComplete(userData);
      } catch (err) {
        // 4. Xử lý lỗi kết nối hoặc lỗi từ Server
        setError("Có lỗi xảy ra: " + err.message);
      } finally {
        // setIsLoading(false);
      }
    } else {
      setError("Vui lòng nhập đầy đủ thông tin!");
    }
  };

  return (
    <div className="min-h-screen bg-red-900 flex items-center justify-center p-4 relative overflow-hidden font-serif">
      {/* --- CSS ANIMATION (Ngựa chạy) --- */}
      <style>{`
  @keyframes gallop {
    0% { transform: translateY(0) rotate(0deg) skewX(0deg); }
    25% { transform: translateY(-2px) rotate(-2deg) skewX(-2deg); }   /* Bắt đầu nhún lên, hơi vươn tới */
    50% { transform: translateY(-10px) rotate(0deg) skewX(-5deg); }   /* Điểm cao nhất, vươn dài người nhất */
    75% { transform: translateY(-4px) rotate(3deg) skewX(0deg); }     /* Hạ xuống, đầu chúi nhẹ */
    100% { transform: translateY(0) rotate(0deg) skewX(0deg); }       /* Tiếp đất mượt */
  }

  /* Hiệu ứng bóng đổ co giãn theo nhịp nhảy */
  @keyframes shadow-pulse {
    0%, 100% { transform: scale(1); opacity: 0.3; } /* Chạm đất: bóng to, đậm */
    50% { transform: scale(0.6); opacity: 0.1; }    /* Nhảy cao: bóng nhỏ, mờ */
  }

  @keyframes dust {
    0% { opacity: 0; transform: translateX(0) scale(0.3); }
    30% { opacity: 0.8; }
    100% { opacity: 0; transform: translateX(-30px) scale(1.2); }
  }

  .animate-gallop {
    display: inline-block;
    /* Dùng linear hoặc cubic-bezier nhẹ để vòng lặp không bị khựng */
    animation: gallop 0.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
  }
  
  .animate-shadow {
    animation: shadow-pulse 0.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
  }

  .animate-dust {
    animation: dust 0.6s linear infinite;
  }
`}</style>

      {/* Background họa tiết chìm */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-30 pointer-events-none"></div>

      {/* --- CARD FORM --- */}
      <div className="bg-[#fffdf5] p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full border-4 border-yellow-600 relative z-10 animate-zoom-in">
        {/* --- LOGO NGỰA CHẠY --- */}
        <div className="text-center mb-6">
          {/* --- COMPONENT HIỂN THỊ --- */}
          <div className="mx-auto w-24 h-24 bg-red-800 rounded-full flex items-center justify-center mb-4 border-4 border-yellow-500 shadow-lg relative overflow-hidden">
            {/* Hiệu ứng bụi gió (Phía sau) */}
            <div className="absolute bottom-5 left-6 w-2 h-2 bg-yellow-100/40 rounded-full animate-dust"></div>
            <div
              className="absolute bottom-6 left-4 w-1.5 h-1.5 bg-white/30 rounded-full animate-dust"
              style={{ animationDelay: "0.2s" }}
            ></div>

            {/* Chú ngựa */}
            <img src="https://res.cloudinary.com/dy9yts4fa/image/upload/v1770915408/9b8652e8d7b213fd96f7af5dcd0d417f_q960hz.gif" />

            {/* Bóng đổ dưới chân (Quan trọng để tạo độ nảy) */}
            <div className="absolute bottom-5 w-10 h-1.5 bg-black rounded-full blur-[3px] animate-shadow"></div>
          </div>

          <h1 className="text-4xl font-bold text-red-800 font-calligraphy mb-2">
            Viếng Chùa Online
          </h1>
          <p className="text-yellow-800 font-bold text-lg bg-yellow-100 inline-block px-4 py-1 rounded-full border border-yellow-300">
            Xuân Bính Ngọ 2026
          </p>
        </div>

        {/* --- FORM NHẬP LIỆU --- */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Thông báo lỗi */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm text-center animate-bounce">
              ⚠️ {error}
            </div>
          )}

          {/* Input Tên */}
          <div>
            <label className="block text-red-900 font-bold mb-1 ml-1 text-sm uppercase tracking-wide">
              Họ và Tên thí chủ
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border-2 border-yellow-400 rounded-xl focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200 bg-white text-lg placeholder-gray-400 transition-all"
              placeholder="Ví dụ: Nguyễn Văn An"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Input Ngày sinh */}
          <div>
            <label className="block text-red-900 font-bold mb-1 ml-1 text-sm uppercase tracking-wide">
              Ngày tháng năm sinh
            </label>
            <input
              type="date"
              required
              max={today} // Chặn chọn ngày tương lai trên UI
              className="w-full p-3 border-2 border-yellow-400 rounded-xl focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200 bg-white text-lg transition-all"
              value={dob}
              onChange={(e) => {
                setDob(e.target.value);
                setError(""); // Xóa lỗi khi người dùng chọn lại
              }}
            />
          </div>

          {/* Nút Submit */}
          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-red-700 to-red-800 text-yellow-50 font-bold py-3.5 rounded-xl hover:from-red-600 hover:to-red-700 transition transform active:scale-95 shadow-lg border-b-4 border-red-900 text-xl flex items-center justify-center gap-2 group"
          >
            <span>Vào Cửa Chùa</span>
            <span className="group-hover:translate-x-1 transition-transform">
              ➔
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
