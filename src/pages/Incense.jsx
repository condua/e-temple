import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Flame } from "lucide-react";
import { useAudio } from "../hooks/useAudio";
import { SOUNDS } from "../data/constants";

const Incense = () => {
  const { isDark, playClick } = useOutletContext();
  const [isLit, setIsLit] = useState(false);
  const [smoke, setSmoke] = useState([]);
  const bellSound = useAudio(SOUNDS.success);

  useEffect(() => {
    let interval;
    if (isLit) {
      interval = setInterval(() => {
        setSmoke((prev) => [
          ...prev,
          // Sửa: Random vị trí rộng hơn một chút để khói tự nhiên hơn
          { id: Date.now(), left: Math.random() * 30 - 15 },
        ]);
      }, 400); // Tăng tốc độ sinh khói một chút (400ms)
    }
    return () => clearInterval(interval);
  }, [isLit]);

  // Dọn dẹp mảng khói để tránh tràn bộ nhớ
  useEffect(() => {
    if (smoke.length > 15) {
      setSmoke((prev) => prev.slice(1));
    }
  }, [smoke]);

  const handleLight = () => {
    playClick();
    setIsLit(true);
    bellSound.playOneShot();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <h2
        className={`text-4xl font-calligraphy mb-4 ${isDark ? "text-yellow-400" : "text-red-800"}`}
      >
        Dâng Hương
      </h2>
      <p
        className={`mb-8 font-serif italic text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}
      >
        "Một nén tâm hương, lòng thành kính"
      </p>

      <div className="relative h-80 w-full flex justify-center items-end mb-8">
        {/* Chân đế bát hương */}
        <div className="absolute bottom-0 w-72 h-12 bg-red-900 rounded-t-lg shadow-2xl border-t border-yellow-600"></div>

        {/* Bát hương */}
        <div className="absolute bottom-6 w-32 h-24 bg-yellow-700 rounded-b-3xl rounded-t-lg border-2 border-yellow-400 flex items-center justify-center shadow-lg z-10 bg-gradient-to-b from-yellow-600 to-yellow-800">
          <div className="w-20 h-16 border border-yellow-500 rounded-full flex items-center justify-center opacity-50">
            <span className="text-4xl text-yellow-200 font-serif">福</span>
          </div>
        </div>

        {/* Cây nhang */}
        <div
          className={`absolute bottom-24 w-1.5 bg-red-800 transition-all duration-1000 origin-bottom z-0 ${isLit ? "h-40" : "h-40"}`}
        >
          {isLit && (
            <>
              {/* Đốm lửa đỏ trên đầu nhang */}
              <div className="absolute -top-1 -left-0.5 w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_15px_orange]"></div>

              {/* Hiệu ứng khói */}
              {smoke.map((s) => (
                <div
                  key={s.id}
                  // LƯU Ý: Xóa class 'opacity-0' để tránh xung đột nếu animation chưa load kịp
                  // Thay vào đó, animation keyframes sẽ tự xử lý việc mờ dần
                  className="absolute -top-4 w-4 h-4 bg-gray-400 rounded-full animate-smoke blur-sm opacity-60"
                  style={{
                    left: `${s.left}px`, // QUAN TRỌNG: Phải thêm đơn vị 'px'
                  }}
                ></div>
              ))}
            </>
          )}
        </div>
      </div>

      {!isLit ? (
        <button
          onClick={handleLight}
          className="px-8 py-3 bg-red-700 text-white rounded-full font-bold shadow-lg hover:bg-red-800 transition flex items-center gap-2 font-serif text-lg border-2 border-yellow-500"
        >
          <Flame size={24} /> Thắp Nhang
        </button>
      ) : (
        <div className="animate-fade-in bg-black/20 p-4 rounded-xl backdrop-blur-sm">
          <p className="text-yellow-500 font-bold text-xl mb-2 font-serif">
            Tâm hương đã thấu, lòng thành chứng giám.
          </p>
        </div>
      )}
    </div>
  );
};

export default Incense;
