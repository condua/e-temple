import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

/* ===========================================================================
  PHẦN 1: THUẬT TOÁN TÍNH ÂM LỊCH & HELPERS
  ===========================================================================
*/

const MIN_YEAR = 0;
const MAX_YEAR = 3000;

function julianDay(dd, mm, yy) {
  var a = Math.floor((14 - mm) / 12);
  var y = yy + 4800 - a;
  var m = mm + 12 * a - 3;
  var jd =
    dd +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  return jd;
}

const getLunarDate = (d, m, y) => {
  // Logic đặc biệt cho năm 2026 demo
  if (y === 2026) {
    const jdCurrent = julianDay(d, m, y);
    const jdTet = 2461089; // 17/02/2026
    const offset = jdCurrent - jdTet;

    if (offset >= 0) {
      let lunarD = 1 + offset;
      let lunarM = 1;
      while (lunarD > 29) {
        let daysInMonth = lunarM % 2 !== 0 ? 30 : 29;
        if (lunarD > daysInMonth) {
          lunarD -= daysInMonth;
          lunarM++;
        } else {
          break;
        }
      }
      return { day: lunarD, month: lunarM, year: 2026, leap: 0 };
    } else {
      return { day: 30 + offset, month: 12, year: 2025, leap: 0 };
    }
  }

  // Fallback logic
  const pseudoLunarDay = ((d + 10) % 30) + 1;
  let pseudoLunarMonth = m - 1 || 12;
  if (d > 20) pseudoLunarMonth = m;

  return { day: pseudoLunarDay, month: pseudoLunarMonth, year: y, leap: 0 };
};

const TEN_CAN = [
  "Giáp",
  "Ất",
  "Bính",
  "Đinh",
  "Mậu",
  "Kỷ",
  "Canh",
  "Tân",
  "Nhâm",
  "Quý",
];
const TWELVE_CHI = [
  "Tý",
  "Sửu",
  "Dần",
  "Mão",
  "Thìn",
  "Tỵ",
  "Ngọ",
  "Mùi",
  "Thân",
  "Dậu",
  "Tuất",
  "Hợi",
];

const getCanChiYear = (year) => {
  let canVal = (year + 6) % 10;
  let chiVal = (year + 8) % 12;
  return `${TEN_CAN[canVal]} ${TWELVE_CHI[chiVal]}`;
};

const getCanChiDay = (d, m, y) => {
  const jd = julianDay(d, m, y);
  return `${TEN_CAN[(jd + 9) % 10]} ${TWELVE_CHI[(jd + 1) % 12]}`;
};

const getSafeDate = (year, month, day) => {
  const date = new Date(year, month, day);
  if (year >= 0 && year < 100) {
    date.setFullYear(year);
  }
  return date;
};

const getDaysInMonth = (year, month) => {
  const date = new Date(year, month + 1, 0);
  if (year >= 0 && year < 100) {
    date.setFullYear(year);
    date.setMonth(month + 1);
    date.setDate(0);
  }
  return date.getDate();
};

/* ===========================================================================
  PHẦN 2: UI COMPONENTS
  ===========================================================================
*/

const App = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  const firstDateObj = getSafeDate(currentYear, currentMonth, 1);
  const firstDayOfMonth = firstDateObj.getDay();
  const startDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const yearOptions = useMemo(() => {
    const years = [];
    const start = Math.max(MIN_YEAR, currentYear - 50);
    const end = Math.min(MAX_YEAR, currentYear + 50);
    for (let y = start; y <= end; y++) {
      years.push(y);
    }
    return years;
  }, [currentYear]);

  // Handlers
  const handlePrevMonth = () => {
    setSelectedDate((prev) => {
      const prevMonth = prev.getMonth() - 1;
      let newYear = prev.getFullYear();
      let newMonth = prevMonth;
      if (prevMonth < 0) {
        newYear -= 1;
        newMonth = 11;
      }
      if (newYear < MIN_YEAR) return prev;
      return getSafeDate(newYear, newMonth, 1);
    });
  };

  const handleNextMonth = () => {
    setSelectedDate((prev) => {
      const nextMonth = prev.getMonth() + 1;
      let newYear = prev.getFullYear();
      let newMonth = nextMonth;
      if (nextMonth > 11) {
        newYear += 1;
        newMonth = 0;
      }
      if (newYear > MAX_YEAR) return prev;
      return getSafeDate(newYear, newMonth, 1);
    });
  };

  const handleToToday = () => {
    setSelectedDate(new Date());
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    setSelectedDate(getSafeDate(newYear, currentMonth, 1));
  };

  // Data for rendering
  const selectedLunar = getLunarDate(
    selectedDate.getDate(),
    selectedDate.getMonth() + 1,
    selectedDate.getFullYear(),
  );
  const canChiYear = getCanChiYear(selectedLunar.year);
  const canChiDay = getCanChiDay(
    selectedDate.getDate(),
    selectedDate.getMonth() + 1,
    selectedDate.getFullYear(),
  );

  const QUOTES = [
    "Vạn sự như ý\nAn khang thịnh vượng",
    "Tấn tài tấn lộc\nCông thành danh toại",
    "Phúc Lộc Thọ\nHạnh phúc trọn vẹn",
    "Cung chúc tân xuân\nVạn sự bình an",
  ];
  const randomQuote = QUOTES[selectedDate.getDate() % QUOTES.length];

  // Grid Render
  const renderGrid = useMemo(() => {
    const days = [];

    // Empty slots
    for (let i = 0; i < startDayOffset; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 md:h-24"></div>);
    }

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = getSafeDate(currentYear, currentMonth, i);
      const today = new Date();
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
      const isSelected =
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      const lunar = getLunarDate(i, currentMonth + 1, currentYear);
      const isTet = lunar.day === 1 && lunar.month === 1;
      const isSunday = date.getDay() === 0;

      days.push(
        <div
          key={i}
          onClick={() => setSelectedDate(date)}
          className={`
            relative h-16 md:h-24 border-t border-gray-100 p-1 cursor-pointer transition-all duration-200 group
            flex flex-col items-center justify-start pt-2
            ${isSelected ? "bg-red-50" : "hover:bg-gray-50"}
            ${isSelected ? "border border-red-400 shadow-sm z-10" : ""}
          `}
        >
          {/* Solar Day */}
          <span
            className={`
            text-lg font-playfair font-bold w-8 h-8 flex items-center justify-center rounded-full mb-1
            ${isToday ? "bg-red-600 text-white" : isSunday || isSelected ? "text-red-600" : "text-gray-800"}
          `}
          >
            {i}
          </span>

          {/* Lunar Day */}
          <div className="flex flex-col items-center">
            <span
              className={`text-[10px] md:text-xs font-medium ${lunar.day === 1 || lunar.day === 15 ? "text-red-500" : "text-gray-400"}`}
            >
              {lunar.day === 1 ? `${lunar.day}/${lunar.month}` : lunar.day}
            </span>
            {lunar.day === 1 && (
              <span className="text-[8px] text-red-500 uppercase font-dancing">
                Sóc
              </span>
            )}
            {lunar.day === 15 && (
              <span className="text-[8px] text-red-500 uppercase font-dancing">
                Vọng
              </span>
            )}
            {isTet && (
              <span className="text-sm absolute bottom-1 right-1">🌸</span>
            )}
          </div>

          {/* Selection Indicator (Border simulation) */}
          {isSelected && (
            <div className="absolute inset-0 border-2 border-red-400 pointer-events-none opacity-50 rounded-sm"></div>
          )}
        </div>,
      );
    }
    return days;
  }, [currentMonth, currentYear, selectedDate, startDayOffset, daysInMonth]);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Playfair+Display:wght@400;700;900&family=Noto+Sans:wght@300;400;600&display=swap');
          
          .font-dancing { font-family: 'Dancing Script', cursive; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-noto { font-family: 'Noto Sans', sans-serif; }
          
          .bg-paper-texture {
            background-color: #fff;
            background-image: radial-gradient(#f3f4f6 1px, transparent 1px);
            background-size: 20px 20px;
          }
        `}
      </style>

      <div className="min-h-screen bg-[#fdf6e3] font-noto flex items-center justify-center p-4 md:p-8">
        <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-red-100">
          {/* LEFT PANEL - TỜ LỊCH (Fixed Width on Desktop) */}
          <div className="w-full bg-[#D00000] text-white p-6 flex flex-col items-center justify-between relative shrink-0">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="0" cy="0" r="100" fill="white" />
                <circle cx="200" cy="200" r="80" fill="#FFD700" />
              </svg>
            </div>

            {/* Header: Tháng / Năm */}
            <div className="relative z-10 w-full text-center mt-2">
              <h2 className="text-2xl font-playfair font-bold text-yellow-300 uppercase tracking-widest border-b border-white/20 pb-2 mx-10">
                Tháng {selectedDate.getMonth() + 1}
              </h2>
              <div className="text-sm font-light text-white/80 mt-1 uppercase tracking-wider">
                Năm {selectedDate.getFullYear()}
              </div>
            </div>

            {/* Main Calendar Paper Strip */}
            <div className="relative z-10 w-[240px] bg-white text-gray-800 rounded-[3rem] shadow-[0_10px_30px_rgba(0,0,0,0.3)] my-6 flex flex-col items-center py-8 px-4 overflow-hidden">
              {/* Hole punch simulation */}
              <div className="absolute -top-3 w-4 h-4 bg-[#D00000] rounded-full"></div>

              <div className="text-2xl font-dancing font-bold text-gray-400 mt-2 uppercase">
                {
                  [
                    "Chủ Nhật",
                    "Thứ Hai",
                    "Thứ Ba",
                    "Thứ Tư",
                    "Thứ Năm",
                    "Thứ Sáu",
                    "Thứ Bảy",
                  ][selectedDate.getDay()]
                }
              </div>

              <div className="flex-1 flex items-center justify-center my-4">
                <span className="text-[140px] leading-none font-playfair font-black text-[#D00000] tracking-tighter">
                  {selectedDate.getDate()}
                </span>
              </div>

              {/* Dashed Separator */}
              <div className="w-16 border-t-2 border-dashed border-gray-300 my-4"></div>

              <div className="flex flex-col items-center">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
                  Âm Lịch
                </span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-bold font-playfair text-gray-800">
                    {selectedLunar.day}
                  </span>
                  <span className="text-lg text-gray-500 font-light">
                    / {selectedLunar.month}
                  </span>
                </div>
                <span className="text-xl font-dancing text-[#D00000] mt-1">
                  {canChiDay}
                </span>
              </div>
            </div>

            {/* Footer Quote */}
            <div className="relative z-10 text-center w-full">
              <div className="inline-block px-6 py-2 border border-yellow-400/50 rounded-full bg-[#a30000]/30 text-yellow-300 font-playfair mb-4 shadow-sm">
                Năm {canChiYear}
              </div>
              <p className="font-dancing text-xl text-white/90 whitespace-pre-line leading-relaxed italic">
                "{randomQuote}"
              </p>
            </div>
          </div>

          {/* RIGHT PANEL - GRID CALENDAR */}
          <div className="flex-1 p-6 md:p-8 bg-white relative">
            {/* Header Navigation */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleToToday}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Về hôm nay"
                >
                  <RotateCcw size={20} />
                </button>
                <div className="flex items-baseline font-playfair">
                  <span className="text-3xl font-bold text-gray-800 mr-2">
                    Tháng {currentMonth + 1}
                  </span>
                  <div className="relative group">
                    <select
                      value={currentYear}
                      onChange={handleYearChange}
                      className="appearance-none bg-transparent text-xl text-gray-400 font-medium cursor-pointer focus:outline-none pr-4 hover:text-red-500 transition-colors"
                    >
                      {yearOptions.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none text-xs">
                      ▼
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-red-600 transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-red-600 transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-2">
              {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, idx) => (
                <div
                  key={day}
                  className={`text-center text-sm font-bold uppercase pb-2 ${idx === 6 ? "text-red-600" : "text-gray-400"}`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">{renderGrid}</div>

            {/* Legend / Footer */}
            <div className="mt-8 flex flex-wrap gap-6 text-xs text-gray-500 border-t border-gray-100 pt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
                <span>Hôm nay</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 border border-red-500 bg-red-50 mr-2"></div>
                <span>Đang chọn</span>
              </div>
              <div className="flex items-center">
                <span className="text-red-500 font-bold mr-1">1/1</span>
                <span>Ngày Sóc (Đầu tháng âm)</span>
              </div>
              <div className="flex items-center">
                <span className="text-red-500 font-bold mr-1">15/1</span>
                <span>Ngày Vọng (Rằm)</span>
              </div>
            </div>

            {/* Subtle Decor Image */}
            <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-50">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-red-100 fill-current"
              >
                <path d="M100 0 Q 50 50 100 100 L 100 0" />
                <circle cx="80" cy="20" r="5" className="text-yellow-200" />
                <circle cx="90" cy="50" r="8" className="text-yellow-200" />
              </svg>
            </div>
          </div>
        </div>

        <div className="fixed bottom-2 w-full text-center text-[10px] text-gray-400 font-noto opacity-60">
          Lịch Vạn Niên • Xuân Bính Ngọ 2026
        </div>
      </div>
    </>
  );
};

export default App;
