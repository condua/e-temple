import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Settings,
  User,
  RefreshCw,
  Home,
  Flame,
  Sparkles,
  Scroll,
  Gift,
  PenTool,
  HeartHandshake,
} from "lucide-react";
import { useAudio } from "../hooks/useAudio";
import { SOUNDS } from "../data/constants";

// Danh sách menu cho Sidebar (Desktop)
const NAV_ITEMS = [
  { path: "/", label: "Trang Chủ", icon: <Home size={20} /> },
  { path: "/incense", label: "Dâng Hương", icon: <Flame size={20} /> },
  { path: "/prayer", label: "Cầu Nguyện", icon: <Sparkles size={20} /> },
  { path: "/fortune", label: "Xin Xăm", icon: <Scroll size={20} /> },
  { path: "/lucky", label: "Hái Lộc", icon: <Gift size={20} /> },
  { path: "/calligraphy", label: "Xin Chữ", icon: <PenTool size={20} /> },
  { path: "/donation", label: "Công Đức", icon: <HeartHandshake size={20} /> },
];

const MainLayout = ({ user, setUser }) => {
  const [isDark, setIsDark] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const bgm = useAudio(SOUNDS.bgm, true);
  const clickSound = useAudio(SOUNDS.click);

  useEffect(() => {
    if (soundEnabled) bgm.toggle();
    else if (bgm.playing) bgm.toggle();
  }, [soundEnabled]);

  const playClick = () => {
    if (soundEnabled) clickSound.playOneShot();
  };

  const handleResetUser = () => {
    localStorage.removeItem("temple_user_2026");
    setUser(null);
    navigate("/");
  };

  const getHeaderTitle = () => {
    const currentItem = NAV_ITEMS.find(
      (item) => item.path === location.pathname,
    );
    return currentItem ? currentItem.label : "Chùa Online 2026";
  };

  // Class cho nền tổng thể (Bao phủ toàn màn hình)
  const appBackgroundClass = isDark ? "bg-slate-900" : "bg-stone-100";
  // Class cho sidebar
  const sidebarClass = isDark
    ? "bg-slate-800 border-slate-700 text-gray-200"
    : "bg-white border-stone-200 text-stone-700";

  return (
    // 1. Thay đổi container chính: Full width, Flex layout
    <div
      className={`min-h-screen w-full font-sans flex transition-colors duration-500 overflow-hidden ${appBackgroundClass}`}
    >
      {/* 2. SIDEBAR (Chỉ hiện trên Desktop - md trở lên) */}
      <aside
        className={`hidden md:flex flex-col w-64 border-r transition-colors duration-500 z-20 ${sidebarClass}`}
      >
        <div className="p-6 border-b border-inherit">
          <h1 className="text-2xl font-bold font-calligraphy text-red-800 flex items-center gap-2">
            <span>⛩️</span> Chùa Online
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-serif">
            Xuân Bính Ngọ 2026
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={playClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-serif ${
                  isActive
                    ? "bg-red-800 text-yellow-400 shadow-md font-bold"
                    : "hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-red-800"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-inherit">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700">
              <User size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">{user?.name}</p>
              <p className="text-xs opacity-70">Thí chủ</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Nền hoa văn chung cho cả vùng content */}
        {!isDark && (
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 pointer-events-none z-0"></div>
        )}
        {isDark && (
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 pointer-events-none z-0"></div>
        )}

        {/* HEADER: Điều chỉnh lại để phù hợp cả 2 giao diện */}
        <header
          className={`${
            isDark
              ? "bg-slate-900/90 border-slate-800"
              : "bg-red-900/95 border-red-800"
          } text-yellow-400 p-4 flex justify-between items-center shadow-lg sticky top-0 z-50 border-b-4 transition-colors duration-500 backdrop-blur-sm`}
        >
          {/* Nút Back chỉ hiện trên Mobile hoặc khi không ở trang chủ */}
          <div className="w-10">
            {location.pathname !== "/" && (
              <Link
                to="/"
                onClick={playClick}
                className="md:hidden p-2 hover:bg-white/10 rounded-full transition inline-block" // Ẩn trên desktop (md:hidden)
              >
                <ChevronLeft />
              </Link>
            )}
          </div>

          <h1 className="text-xl font-bold font-calligraphy uppercase tracking-wider truncate mx-2">
            {getHeaderTitle()}
          </h1>

          <div className="flex gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-full transition ${
                soundEnabled ? "text-yellow-400 bg-white/10" : "text-gray-400"
              }`}
              title="Âm thanh"
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button
              onClick={() => {
                playClick();
                setIsDark(!isDark);
              }}
              className="p-2 hover:bg-white/10 rounded-full transition"
              title="Giao diện"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="relative">
              <button
                onClick={() => {
                  playClick();
                  setShowSettings(!showSettings);
                }}
                className="p-2 hover:bg-white/10 rounded-full transition"
              >
                <Settings size={20} />
              </button>
              {showSettings && (
                <div className="absolute right-0 top-12 bg-white text-gray-800 shadow-xl rounded-lg p-4 w-64 border border-gray-200 z-50 animate-fade-in font-serif">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                    <div className="bg-red-100 p-2 rounded-full">
                      <User size={20} className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-bold text-sm truncate max-w-[140px]">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.dob
                          ? new Date(user.dob).toLocaleDateString("vi-VN")
                          : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleResetUser}
                    className="w-full text-left text-red-600 text-sm hover:bg-red-50 p-2 rounded flex items-center gap-2"
                  >
                    <RefreshCw size={14} /> Nhập lại thông tin
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTAINER NỘI DUNG CHÍNH */}
        <main className="flex-1 overflow-y-auto relative z-10 w-full flex justify-center">
          {/* QUAN TRỌNG: Giữ cấu hình "điện thoại" (max-w-lg) ngay cả trên desktop.
            Trên desktop (md), ta tăng nhẹ lên max-w-2xl cho thoáng, nhưng vẫn giữ khung dọc
            để không vỡ layout các tính năng như bát hương.
          */}
          <div
            className={`w-full max-w-lg md:max-w-2xl min-h-full shadow-2xl transition-colors duration-500 ${isDark ? "bg-slate-900" : "bg-[#fffdf5]"}`}
          >
            <Outlet context={{ isDark, playClick, user }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
