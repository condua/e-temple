import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Gift, X, Sparkles } from "lucide-react";
import { useAudio } from "../hooks/useAudio";
import { SOUNDS } from "../data/constants";

// Component hoa mai/đào trang trí
const Blossom = ({ top, left, delay, color = "bg-yellow-300" }) => (
  <div
    className={`absolute w-3 h-3 md:w-4 md:h-4 ${color} rounded-full opacity-80 animate-pulse`}
    style={{ top, left, animationDelay: delay }}
  >
    <div className="absolute inset-0 bg-white/40 blur-[2px] rounded-full"></div>
  </div>
);

const LuckyMoney = () => {
  // Nếu không dùng outlet context thì mock function để test, bạn có thể bỏ dòng này nếu đã có context thật
  const context = useOutletContext() || {};
  const playClick = context.playClick || (() => {});

  const [result, setResult] = useState(null);
  const [openedIndices, setOpenedIndices] = useState([]);
  const successSound = useAudio(SOUNDS.success);

  const rewards = [
    { type: "money", val: "10.000đ", wish: "Lộc nhỏ đầu xuân" },
    { type: "wish", val: "Vạn Sự Như Ý", wish: "Cầu được ước thấy" },
    { type: "wish", val: "Mã Đáo Thành Công", wish: "Sự nghiệp thăng tiến" },
    { type: "item", val: "Vòng Tay Bình An", wish: "Gia đạo an khang" },
    { type: "money", val: "68.000đ", wish: "Lộc phát tài tài" },
    { type: "wish", val: "Tấn Tài Tấn Lộc", wish: "Tiền vào như nước" },
  ];

  // Cập nhật vị trí bám sát theo các cành cây CSS vẽ bên dưới
  // top/left được tinh chỉnh để rải đều ra 2 bên thân cây
  const envelopePositions = [
    { top: "28%", left: "35%", delay: "0s" }, // Cành cao bên trái
    { top: "17%", left: "70%", delay: "1s" }, // Ngọn bên phải
    { top: "26%", left: "15%", delay: "0.5s" }, // Cành giữa trái xa
    { top: "11%", left: "85%", delay: "1.5s" }, // Cành giữa phải xa
    { top: "55%", left: "30%", delay: "0.2s" }, // Gần thân cây trái
    { top: "49%", left: "73%", delay: "1.2s" }, // Gần thân cây phải
    { top: "80%", left: "20%", delay: "0.8s" }, // Cành thấp trái    { top: "80%", left: "20%", delay: "0.8s" }, // Cành thấp trái
    { top: "78%", left: "35%", delay: "0.8s" }, // Cành thấp trái

    { top: "70%", left: "65%", delay: "0.4s" }, // Cành thấp phải
    { top: "75%", left: "80%", delay: "0.4s" }, // Cành thấp phải
  ];

  const pickRedEnvelope = (index) => {
    if (openedIndices.includes(index) || result) return;

    playClick();
    if (successSound && successSound.playOneShot) successSound.playOneShot();

    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    setOpenedIndices([...openedIndices, index]);
    setResult(reward);
  };

  const closeResult = () => {
    playClick();
    setResult(null);
  };

  return (
    // Thay đổi: min-h-screen để full màn hình, flex-col để chia bố cục
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-gradient-to-b from-sky-200 via-green-100 to-green-50 font-serif">
      {/* --- HEADER (Chiếm không gian cố định phía trên) --- */}
      <div className="relative z-30 text-center pt-8 pb-4 px-4">
        <h2 className="text-3xl md:text-5xl font-calligraphy text-red-800 font-bold drop-shadow-white">
          Hái Lộc Đầu Xuân
        </h2>
        <p className="text-sm md:text-base text-green-900 italic mt-2 font-serif bg-white/40 inline-block px-6 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
          "Lì xì đỏ thắm, lộc vàng trao tay"
        </p>
      </div>

      {/* --- KHUNG CÂY & BAO LÌ XÌ (Chiếm phần còn lại - flex-1) --- */}
      <div className="flex-1 relative w-full max-w-4xl mx-auto">
        {/* --- CÂY MAI/ĐÀO (Vẽ bằng CSS) --- */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Gốc cây */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 md:w-12 h-[90%] bg-[#5D4037] rounded-t-full shadow-xl">
            {/* Vân gỗ */}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-20 bg-[#4E342E] rounded-full opacity-50"></div>
          </div>

          {/* Các cành lớn (Dùng % để scale theo màn hình) */}
          {/* Cành trái dưới */}
          <div className="absolute bottom-[30%] left-1/2 w-[45%] h-3 md:h-5 bg-[#5D4037] -translate-x-full origin-right -rotate-[10deg] rounded-full"></div>
          {/* Cành phải dưới */}
          <div className="absolute bottom-[40%] left-1/2 w-[40%] h-3 md:h-4 bg-[#5D4037] origin-left rotate-[15deg] rounded-full"></div>
          {/* Cành trái trên */}
          <div className="absolute bottom-[60%] left-1/2 w-[35%] h-2 md:h-4 bg-[#5D4037] -translate-x-full origin-right -rotate-[20deg] rounded-full"></div>
          {/* Cành phải trên */}
          <div className="absolute bottom-[80%] left-1/2 w-[40%] h-2 md:h-3 bg-[#5D4037] origin-left rotate-[-20deg] rounded-full"></div>

          <div className="absolute bottom-[80%] left-1/2 w-[40%] h-2 md:h-3 bg-[#5D4037] -translate-x-full origin-left -rotate-[-5deg] rounded-full"></div>

          <div className="absolute bottom-[55%] left-1/2 w-[35%] h-2 md:h-4 bg-[#5D4037] origin-right rotate-[10deg] rounded-full"></div>

          {/* Tán lá/Hoa nền */}
          <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-full h-[80%] bg-yellow-400/10 blur-3xl rounded-full"></div>

          {/* Hoa rơi rải rác */}
          <Blossom top="20%" left="25%" delay="0s" />
          <Blossom top="15%" left="65%" delay="1s" />
          <Blossom top="45%" left="15%" delay="2s" />
          <Blossom top="35%" left="80%" delay="0.5s" />
          <Blossom top="60%" left="90%" delay="1.5s" color="bg-pink-300" />
          <Blossom top="55%" left="10%" delay="1.2s" color="bg-pink-300" />
        </div>

        {/* --- DANH SÁCH BAO LÌ XÌ --- */}
        <div className="absolute inset-0 z-10 overflow-hidden">
          {envelopePositions.map((pos, idx) => {
            const isOpened = openedIndices.includes(idx);
            if (isOpened) return null;

            return (
              <div
                key={idx}
                className="absolute animate-sway cursor-pointer origin-top group"
                style={{
                  top: pos.top,
                  left: pos.left,
                  animationDelay: pos.delay,
                  // Quan trọng: translate-x-1/2 để tâm bao lì xì nằm đúng điểm toạ độ
                  transform: "translateX(-50%)",
                }}
                onClick={() => pickRedEnvelope(idx)}
              >
                {/* Dây treo - height responsive */}
                <div className="absolute -top-6 md:-top-10 left-1/2 -translate-x-1/2 w-[1px] h-6 md:h-10 bg-yellow-700/60"></div>

                {/* Bao lì xì - Responsive size (w-12 mobile, w-20 desktop) */}
                <div
                  className="
                  w-12 h-16 md:w-20 md:h-28 
                  bg-gradient-to-br from-red-600 to-red-800 
                  rounded-md md:rounded-lg border-[1px] md:border-2 border-yellow-400 
                  shadow-lg flex flex-col items-center justify-center 
                  relative overflow-hidden transition-transform duration-300 
                  hover:scale-110 active:scale-95
                "
                >
                  {/* Họa tiết trang trí trên bao */}
                  <div className="absolute -right-2 -top-2 md:-right-4 md:-top-4 w-6 h-6 md:w-10 md:h-10 bg-yellow-400/30 rounded-full blur-sm md:blur-md"></div>

                  <div className="w-6 h-6 md:w-10 md:h-10 border border-yellow-400 rounded-full flex items-center justify-center mb-0.5 md:mb-2 bg-red-900/50 shadow-inner">
                    <span className="text-yellow-400 font-bold text-[8px] md:text-xs uppercase">
                      Tết
                    </span>
                  </div>

                  <span className="text-lg md:text-3xl drop-shadow-md filter contrast-125">
                    🧧
                  </span>

                  {/* Hiệu ứng lấp lánh quét qua */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- MODAL KẾT QUẢ --- */}
      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={closeResult}
          ></div>

          {/* Modal Box */}
          <div className="bg-[#fffdf5] w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border-4 border-yellow-500 relative animate-zoom-in z-10">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10 pointer-events-none"></div>

            <button
              onClick={closeResult}
              className="absolute top-2 right-2 p-1 bg-gray-200 hover:bg-red-100 rounded-full transition z-20 text-gray-600 hover:text-red-600"
            >
              <X size={20} />
            </button>

            <div className="p-8 flex flex-col items-center text-center relative z-10">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 border-2 border-red-200 relative">
                <Gift size={40} className="text-red-600 animate-bounce" />
                <Sparkles className="absolute -top-2 -right-2 text-yellow-500 animate-spin-slow" />
              </div>

              <h3 className="text-2xl font-bold font-calligraphy text-red-800 mb-2">
                Chúc Mừng!
              </h3>
              <p className="text-gray-500 font-serif text-sm mb-4">
                Bạn vừa nhận được
              </p>

              <div className="bg-gradient-to-r from-red-600 to-red-700 text-yellow-100 px-6 py-4 rounded-xl shadow-inner mb-4 w-full border border-yellow-600">
                <p className="text-2xl md:text-3xl font-bold tracking-wider">
                  {result.val}
                </p>
              </div>

              <p className="text-yellow-700 font-serif italic text-base">
                "{result.wish}"
              </p>

              <button
                onClick={closeResult}
                className="mt-6 px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-red-900 font-bold rounded-full shadow-lg transition transform active:scale-95 w-full uppercase tracking-wider border-b-4 border-yellow-600 hover:border-yellow-500"
              >
                Nhận Lộc Ngay
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .drop-shadow-white { filter: drop-shadow(0 1px 1px rgba(255,255,255,0.8)); }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        /* Animation lắc lư */
        @keyframes sway {
          0%, 100% { transform: translateX(-50%) rotate(-3deg); }
          50% { transform: translateX(-50%) rotate(3deg); }
        }
        .animate-sway { animation: sway 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default LuckyMoney;
