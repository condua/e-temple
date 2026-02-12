import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { HeartHandshake } from "lucide-react";
import { useAudio } from "../hooks/useAudio";
import { SOUNDS } from "../data/constants";

const Donation = () => {
  const { isDark, playClick } = useOutletContext();
  const [donated, setDonated] = useState(false);
  const bellSound = useAudio(SOUNDS.success);

  const handleDonate = () => {
    playClick();
    setDonated(true);
    bellSound.playOneShot();
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      {!donated ? (
        <>
          <div className="w-32 h-32 bg-red-900 rounded-lg border-4 border-yellow-500 mb-6 flex items-center justify-center shadow-2xl relative">
            <div className="w-20 h-2 bg-black opacity-50 rounded-full"></div>
            <span className="absolute text-yellow-400 font-bold font-serif top-2 uppercase tracking-widest">
              Công Đức
            </span>
            <div className="absolute bottom-2 text-yellow-600 text-xs font-serif">
              2026
            </div>
          </div>
          <h2
            className={`text-3xl font-bold font-calligraphy mb-4 ${isDark ? "text-yellow-400" : "text-gray-800"}`}
          >
            Hòm Công Đức
          </h2>
          <p
            className={`mb-8 font-serif ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Tùy hỷ đóng góp, tu bổ chùa chiền, hỗ trợ hoạt động thiện nguyện.
          </p>

          <div className="grid grid-cols-2 gap-4 w-full max-w-xs font-serif">
            {["10.000đ", "20.000đ", "50.000đ", "Tùy tâm"].map((amt) => (
              <button
                key={amt}
                onClick={handleDonate}
                className="p-4 bg-green-100 text-green-900 rounded-lg hover:bg-green-200 border border-green-300 font-bold shadow-sm transition active:scale-95"
              >
                {amt}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="animate-zoom-in">
          <HeartHandshake size={80} className="text-red-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold font-calligraphy text-red-600 mb-2">
            Công Đức Vô Lượng
          </h2>
          <p
            className={`mb-6 font-serif ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Nhà chùa xin ghi nhận tấm lòng vàng của thí chủ.
          </p>
          <button
            onClick={() => {
              playClick();
              setDonated(false);
            }}
            className="block w-full py-3 text-gray-500 hover:text-gray-800 font-serif underline"
          >
            Quay lại
          </button>
        </div>
      )}
    </div>
  );
};

export default Donation;
