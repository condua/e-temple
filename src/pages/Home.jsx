import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  Flame,
  Sparkles,
  Scroll,
  Gift,
  HeartHandshake,
  Calendar,
  HandHeart,
} from "lucide-react";

const Home = () => {
  const { isDark, playClick, user } = useOutletContext();

  const menuItems = [
    {
      id: "incense",
      label: "Dâng Lễ & Nhang",
      path: "/incense",
      icon: <Flame className="text-orange-500" />,
      color: "bg-orange-50",
    },
    {
      id: "prayer",
      label: "Cầu Nguyện",
      path: "/prayer",
      icon: <HandHeart className="text-purple-500" />,
      color: "bg-purple-50",
    },
    {
      id: "fortune",
      label: "Xin Xăm",
      path: "/fortune",
      icon: <Scroll className="text-red-500" />,
      color: "bg-red-50",
    },
    {
      id: "lucky",
      label: "Hái Lộc",
      path: "/lucky",
      icon: <Gift className="text-green-500" />,
      color: "bg-green-50",
    },
    {
      id: "calligraphy",
      label: "Xin Chữ",
      path: "/calligraphy",
      icon: <span className="text-2xl">🖌️</span>,
      color: "bg-yellow-50",
    },
    {
      id: "calendar",
      label: "Lịch Vạn Niên",
      path: "/calendar",
      icon: <Calendar className="text-red-400" size={20} />,
      color: "bg-blue-50",
    },
    {
      id: "donation",
      label: "Công Đức",
      path: "/donation",
      icon: <HeartHandshake className="text-pink-500" />,
      color: "bg-pink-50",
    },
  ];

  return (
    <div className="p-6 overflow-y-auto pb-24 h-full">
      <div className="bg-gradient-to-r from-red-800 to-red-600 rounded-2xl p-8 text-white mb-8 shadow-xl relative overflow-hidden group border-2 border-yellow-500">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold font-calligraphy mb-2">
            Xin chào thí chủ, {user.name}
          </h2>
          <p className="opacity-90 text-base font-serif">
            Năm mới Bính Ngọ 2026
          </p>
          <p className="text-yellow-300 font-bold font-serif mt-1">
            Mã Đáo Thành Công - Vạn Sự Như Ý
          </p>
        </div>
        {/* <div className="absolute right-[-20px] top-[-20px] text-[10rem] opacity-10 rotate-12 transition-transform group-hover:rotate-0 duration-700">
          🐎
        </div> */}
        <img
          className="absolute right-[-10px] top-[-40px] opacity-90"
          src="https://res.cloudinary.com/dy9yts4fa/image/upload/v1770915408/9b8652e8d7b213fd96f7af5dcd0d417f_q960hz.gif"
        />
        <div className="absolute left-[-20px] bottom-[-20px] text-8xl opacity-10">
          🌸
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            onClick={playClick}
            className={`${isDark ? "bg-slate-800 border-slate-700 hover:bg-slate-700" : `${item.color} border-white`} p-4 rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center gap-3 border-2 aspect-square group`}
          >
            <div
              className={`p-4 rounded-full shadow-sm transition-transform group-hover:scale-110 ${isDark ? "bg-slate-700" : "bg-white"}`}
            >
              {item.icon}
            </div>
            <span
              className={`font-bold font-serif text-sm md:text-base text-center ${isDark ? "text-gray-200" : "text-gray-800"}`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
      <div
        className={`mt-10 text-center sm:text-lg text-xs font-serif ${isDark ? "text-gray-500" : "text-gray-400"}`}
      >
        <p>Xuân Bính Ngọ 2026 - Giữ gìn bản sắc văn hóa Việt.</p>

        <p className="mt-2">
          © {new Date().getFullYear()} Phan Hoàng Phúc. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Home;
