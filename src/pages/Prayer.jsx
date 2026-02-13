import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Sparkles,
  Send,
  Scroll,
  Hand,
  Heart,
  HeartHandshake,
  Gem,
  HeartPulse,
} from "lucide-react";
import { simulateAIPrayer } from "../utils/helpers";
import { useAudio } from "../hooks/useAudio";
import { SOUNDS } from "../data/constants";

const Prayer = () => {
  const { isDark, playClick, user } = useOutletContext();
  const [type, setType] = useState("health");
  const [isGenerating, setIsGenerating] = useState(false);
  const [prayerText, setPrayerText] = useState("");
  const bellSound = useAudio(SOUNDS.success);

  // Hiệu ứng gõ từng chữ (Typewriter effect) để tăng sự linh thiêng
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (prayerText) {
      let i = 0;
      setDisplayedText("");
      const typing = setInterval(() => {
        setDisplayedText((prev) => prev + prayerText.charAt(i));
        i++;
        if (i >= prayerText.length) clearInterval(typing);
      }, 30); // Tốc độ hiện chữ
      return () => clearInterval(typing);
    }
  }, [prayerText]);

  const handlePray = async () => {
    playClick();
    setIsGenerating(true);
    setPrayerText("");
    setDisplayedText("");

    // Giả lập thời gian "thắp hương khấn vái"
    const age =
      new Date().getFullYear() -
      new Date(user?.dob || Date.now()).getFullYear();
    const text = await simulateAIPrayer(type, user?.name || "Tín chủ", age);

    setPrayerText(text);
    setIsGenerating(false);
    bellSound.playOneShot();
  };

  const prayerOptions = [
    {
      id: "health",
      label: "Cầu Sức Khỏe",
      icon: <HeartPulse className="w-6 h-6" />,
      desc: "Bệnh tật tiêu tan, thân tâm an lạc",
    },
    {
      id: "career",
      label: "Cầu Công Danh",
      icon: <Scroll className="w-6 h-6" />,
      desc: "Thăng quan tiến chức, mã đáo thành công",
    },
    {
      id: "love",
      label: "Cầu Tình Duyên",
      icon: <Heart className="w-6 h-6" />,
      desc: "Se duyên kết tóc, tìm được ý trung nhân",
    },
    {
      id: "repent",
      label: "Sám Hối",
      icon: <Hand className="w-6 h-6" />,
      desc: "Rũ bỏ muộn phiền, tâm hồn thanh tịnh",
    },
  ];

  return (
    <div className="flex flex-col h-full p-2 md:p-6 max-w-2xl mx-auto">
      {/* Header trang trí */}
      <div className="text-center mb-6 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-800/30 to-transparent"></div>
        <h2
          className={`relative inline-block px-4 text-4xl font-calligraphy font-bold ${isDark ? "text-yellow-400 bg-slate-900" : "text-red-800 bg-[#fffdf5]"}`}
        >
          Sớ Cầu An
        </h2>
        <p
          className={`mt-2 font-serif text-sm italic ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          "Lòng thành thắp một nén hương / Khói thơm bay thấu mười phương Phật
          đài"
        </p>
      </div>

      {/* Chọn loại cầu nguyện - Style thẻ bài */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {prayerOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => {
              playClick();
              setType(opt.id);
            }}
            className={`group relative overflow-hidden p-4 rounded-xl border transition-all duration-300 flex flex-row sm:flex-col items-center gap-3 text-left sm:text-center
              ${
                type === opt.id
                  ? "border-red-600 bg-red-50 dark:bg-red-900/30 ring-2 ring-red-200 dark:ring-red-900"
                  : "border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-red-300"
              }`}
          >
            <div
              className={`p-3 rounded-full transition-colors ${type === opt.id ? "bg-red-600 text-white shadow-lg" : "bg-stone-100 dark:bg-slate-700 text-stone-500"}`}
            >
              {opt.icon}
            </div>
            <div>
              <span
                className={`block font-bold font-serif ${type === opt.id ? "text-red-800 dark:text-red-300" : "text-gray-700 dark:text-gray-300"}`}
              >
                {opt.label}
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 hidden sm:block mt-1">
                {opt.desc}
              </span>
            </div>
            {/* Họa tiết góc */}
            {type === opt.id && (
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-600"></div>
            )}
            {type === opt.id && (
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-600"></div>
            )}
          </button>
        ))}
      </div>

      {/* Khu vực hiển thị lời khấn - Style tờ sớ/giấy dó */}
      <div className="flex-1 mb-6 relative group perspective-1000">
        {/* Background giấy dó */}
        <div
          className={`absolute inset-0 rounded-lg shadow-inner border-2 
          ${
            isDark
              ? "bg-slate-800 border-yellow-800/50"
              : "bg-[#f4ebd9] border-[#d4c5a9]"
          } 
          bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-100 z-0`}
        ></div>

        {/* Nội dung */}
        <div className="relative z-10 h-full p-6 sm:p-8 overflow-y-auto font-serif flex flex-col items-center justify-center min-h-[300px]">
          {/* Hoa văn chìm */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <div className="text-[150px] text-red-900 rotate-12">🪷</div>
          </div>

          {isGenerating ? (
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 animate-pulse"></div>
                <Sparkles className="animate-spin text-yellow-600 w-12 h-12 mx-auto relative z-10" />
              </div>
              <p className="font-calligraphy text-xl text-yellow-700 animate-pulse">
                Đang dâng sớ lên thiên đình...
              </p>
            </div>
          ) : displayedText ? (
            <div className="w-full">
              <div className="mb-4 text-center border-b border-red-800/20 pb-2">
                <span
                  className={`sm:text-lg text-sm  uppercase tracking-[0.3em] ${isDark ? "text-red-600/90" : "text-red-800/60 "} font-bold`}
                >
                  Phụng Thiên Thừa Vận
                </span>
              </div>
              <p
                className={`font-calligraphy text-2xl sm:text-3xl leading-relaxed text-justify indent-8 first-letter:text-4xl first-letter:font-bold first-letter:text-red-700
                ${isDark ? "text-gray-200" : "text-stone-800"}`}
              >
                {displayedText}
              </p>
              <div className="mt-8 flex justify-end">
                <div className="border-2 border-red-700 p-2 inline-block rounded-sm rotate-[-5deg] opacity-80">
                  <div className="border border-red-700 px-3 py-1 text-red-700 font-bold text-xs uppercase text-center">
                    Ấn
                    <br />
                    Chứng
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center opacity-40">
              <Scroll className="w-16 h-16 mx-auto mb-4" />
              <p
                className={`font-serif italic ${isDark ? "text-white" : "text-gray-500"}`}
              >
                Hãy chọn ý nguyện và gửi lời khấn chân thành.
              </p>
            </div>
          )}
        </div>

        {/* Cuộn sớ trang trí 2 đầu */}
        <div className="absolute -top-3 left-2 right-2 h-4 bg-yellow-800 rounded-full shadow-lg z-20 flex items-center justify-center overflow-hidden">
          <div className="w-full h-[1px] bg-yellow-600/50"></div>
        </div>
        <div className="absolute -bottom-3 left-2 right-2 h-4 bg-yellow-800 rounded-full shadow-lg z-20 flex items-center justify-center overflow-hidden">
          <div className="w-full h-[1px] bg-yellow-600/50"></div>
        </div>
      </div>

      {/* Button Action */}
      <button
        onClick={handlePray}
        disabled={isGenerating}
        className="relative w-full group bg-gradient-to-r from-red-700 to-red-900 text-yellow-100 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10"></div>
        <div className="relative flex items-center justify-center gap-3 font-serif text-xl uppercase tracking-wider">
          <Send size={24} className={isGenerating ? "animate-ping" : ""} />
          {isGenerating ? "Đang gửi..." : "Gửi Lời Nguyện"}
        </div>

        {/* Shine effect */}
        <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shine" />
      </button>

      {/* CSS Animation cho Shine effect */}
      <style>{`
        @keyframes shine {
          100% { left: 125%; }
        }
        .animate-shine {
          animation: shine 1s;
        }
      `}</style>
    </div>
  );
};

export default Prayer;
