import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { FORTUNES, SOUNDS } from "../data/constants";
import { useAudio } from "../hooks/useAudio";

const Fortune = () => {
  const { isDark, playClick } = useOutletContext();
  const [shaking, setShaking] = useState(false);
  const [result, setResult] = useState(null);
  const shakeSound = useAudio(SOUNDS.shake);
  const successSound = useAudio(SOUNDS.success);

  const shakeTube = () => {
    playClick();
    setResult(null);
    setShaking(true);
    shakeSound.playOneShot();

    setTimeout(() => {
      setShaking(false);
      const randomFortune =
        FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
      setResult(randomFortune);
      successSound.playOneShot();
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center h-full p-4 overflow-y-auto">
      <h2
        className={`text-4xl font-calligraphy mb-4 ${isDark ? "text-yellow-400" : "text-red-800"}`}
      >
        Xin Quẻ Bính Ngọ
      </h2>

      {!result ? (
        <div className="flex flex-col items-center justify-center flex-1 w-full">
          <div
            onClick={shakeTube}
            className={`cursor-pointer w-48 h-72 bg-red-900 rounded-[3rem] border-8 border-yellow-500 relative flex items-center justify-center shadow-2xl mb-10 transition-transform ${shaking ? "animate-shake" : "hover:-translate-y-2"}`}
          >
            <div className="text-7xl text-yellow-400 font-bold opacity-80 writing-vertical font-serif border-2 border-yellow-400 p-2 rounded">
              求簽
            </div>
            <div className="absolute -top-8 w-32 h-12 bg-yellow-100/30 rounded-full blur-sm"></div>
            <div className="absolute -top-4 w-3/4 h-2 bg-yellow-400 rounded-full"></div>
          </div>
          <button
            onClick={shakeTube}
            disabled={shaking}
            className="px-10 py-4 bg-yellow-600 text-white rounded-full font-bold shadow-lg hover:bg-yellow-700 transition font-serif text-xl border-b-4 border-yellow-800"
          >
            {shaking ? "Đang lắc..." : "Gieo Quẻ"}
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md animate-zoom-in mt-2 pb-20">
          <div className="bg-[#fffdf5] border-8 border-double border-red-800 p-8 rounded-lg text-center shadow-2xl relative">
            <h3 className="text-3xl font-bold text-red-800 mb-2 uppercase font-serif border-b-2 border-red-200 pb-2">
              {result.title}
            </h3>
            <div className="my-6">
              <p className="text-gray-800 mb-4 font-serif text-xl leading-relaxed">
                {result.content}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 relative">
              <p className="text-red-700 italic font-medium font-serif text-lg">
                {result.poem}
              </p>
            </div>
            <button
              onClick={() => {
                playClick();
                setResult(null);
              }}
              className="mt-8 text-sm text-gray-500 flex items-center justify-center w-full gap-2 hover:text-red-600 font-serif uppercase tracking-widest"
            >
              <RefreshCw size={16} /> Xin quẻ khác
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fortune;
