import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { CALLIGRAPHY_WORDS, SOUNDS } from "../data/constants";
import { simulateAICalligraphy } from "../utils/helpers";
import { useAudio } from "../hooks/useAudio";

const Calligraphy = () => {
  const { isDark, playClick, user } = useOutletContext();
  const [selectedChar, setSelectedChar] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [step, setStep] = useState(1);
  const bellSound = useAudio(SOUNDS.success);

  const handleSelect = async (charInfo) => {
    playClick();
    setSelectedChar(charInfo);
    setStep(2);
    const result = await simulateAICalligraphy(charInfo.char, user.name);
    setAiResult(result);
    setStep(3);
    bellSound.playOneShot();
  };

  return (
    <div className="h-screen flex flex-col p-4">
      <h2
        className={`text-4xl font-calligraphy text-center mb-4 ${isDark ? "text-yellow-400" : "text-gray-800"}`}
      >
        Xin Chữ Ông Đồ
      </h2>

      {step === 1 && (
        <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-4">
          {CALLIGRAPHY_WORDS.map((word) => (
            <button
              key={word.char}
              onClick={() => handleSelect(word)}
              className={`border rounded-xl p-4 text-center transition hover:scale-105 active:scale-95 ${isDark ? "bg-gray-800 border-gray-600 hover:border-yellow-500" : "bg-red-50 hover:bg-red-100 border-red-200"}`}
            >
              <div
                className={`text-4xl font-calligraphy font-bold mb-2 ${isDark ? "text-yellow-500" : "text-red-800"}`}
              >
                {word.char}
              </div>
              <div
                className={`text-xs font-serif ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {word.meaning}
              </div>
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-32 h-32 mb-6 relative">
            <div className="absolute inset-0 border-4 border-gray-800 rounded-lg bg-[#fffdf5] flex items-center justify-center shadow-inner">
              <span className="text-6xl font-calligraphy animate-pulse text-black opacity-60">
                ...
              </span>
            </div>
            <div className="absolute -right-6 -bottom-6 text-6xl animate-bounce">
              🖌️
            </div>
          </div>
          <p
            className={`font-serif italic text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            Ông đồ đang mài mực, thảo nét...
          </p>
        </div>
      )}

      {step === 3 && aiResult && (
        <div className="flex-1 flex flex-col items-center animate-fade-in overflow-y-auto">
          <div className="bg-[#f0e6d2] p-8 rounded shadow-2xl border-t-[12px] border-b-[12px] border-red-900 w-full max-w-sm mb-6 relative bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]">
            <h1 className="text-7xl text-center font-calligraphy font-bold text-black mb-8 mt-4 drop-shadow-md">
              {selectedChar.char}
            </h1>
            <div className="w-full h-px bg-black/20 my-4"></div>
            <p className="text-center font-serif text-xl text-gray-900 italic leading-loose font-medium">
              {aiResult.poem}
            </p>
          </div>
          <button
            onClick={() => {
              playClick();
              setStep(1);
              setSelectedChar(null);
              setAiResult(null);
            }}
            className={`w-full py-4 rounded-xl font-bold font-serif uppercase tracking-wider ${isDark ? "bg-yellow-600 text-gray-900 hover:bg-yellow-500" : "bg-gray-800 text-white hover:bg-gray-700"}`}
          >
            Xin chữ khác
          </button>
        </div>
      )}
    </div>
  );
};

export default Calligraphy;
