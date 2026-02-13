import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useOutletContext } from "react-router-dom";

/* ===========================================================================
   PHẦN 1: THUẬT TOÁN ÂM LỊCH VIỆT NAM (CHUẨN HOÁ)
   Source reference: Algorithm based on Ho Ngoc Duc's library
   ===========================================================================
*/

// Tử khí (Julian Date của các điểm sóc chính)
const PI = Math.PI;

function jdFromDate(dd, mm, yy) {
  let a = Math.floor((14 - mm) / 12);
  let y = yy + 4800 - a;
  let m = mm + 12 * a - 3;
  return (
    dd +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

// Tính ngày sóc (New Moon)
function getNewMoonDay(k, timeZone) {
  let T = k / 1236.85;
  let T2 = T * T;
  let T3 = T2 * T;
  let dr = PI / 180;
  let Jd1 =
    2415020.75933 +
    29.53058868 * k +
    0.0001178 * T2 -
    0.000000155 * T3 +
    0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  let M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  let Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  let F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 =
    (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * M * dr);
  let C2 = -0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(2 * Mpr * dr);
  let C3 = -0.0004 * Math.sin(2 * F * dr);
  let JdNew = Jd1 + C1 + C2 + C3;
  return JdNew + 0.5 + timeZone / 24;
}

// Tính kinh độ mặt trời
function getSunLongitude(jdn, timeZone) {
  let T = (jdn - 2451545.0 - 0.5 - timeZone / 24) / 36525;
  let T2 = T * T;
  let dr = PI / 180;
  let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T2;
  let M = 357.52911 + 35999.05029 * T - 0.0001537 * T2;
  let C =
    (1.914602 - 0.004817 * T - 0.000014 * T2) * Math.sin(M * dr) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M * dr) +
    0.000289 * Math.sin(3 * M * dr);
  return (L0 + C) % 360; // Trả về kinh độ
}

// Tìm ngày sóc của tháng 11 âm lịch
function getLunarMonth11(yy, timeZone) {
  let off = jdFromDate(31, 12, yy) - 2415021;
  let k = Math.floor(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  let sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 270) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return Math.floor(nm);
}

// Hàm chính: Chuyển đổi Dương -> Âm
const convertSolar2Lunar = (dd, mm, yy, timeZone = 7) => {
  let dayNumber = jdFromDate(dd, mm, yy);
  let k = Math.floor((dayNumber - 2415021) / 29.530588853);
  let monthStart = Math.floor(getNewMoonDay(k, timeZone));
  if (monthStart > dayNumber) {
    monthStart = Math.floor(getNewMoonDay(k - 1, timeZone));
  }

  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  if (a11 >= monthStart) {
    let lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    a11 = getLunarMonth11(yy, timeZone);
    b11 = getLunarMonth11(yy + 1, timeZone);
  }

  let lunarDay = dayNumber - monthStart + 1;
  let diff = Math.floor((monthStart - a11) / 29);
  let lunarMonth = diff + 11;
  let lunarYear = yy;

  if (b11 - a11 > 365) {
    let leapMonthDiff = Math.floor((b11 - a11) / 29);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
    }
  }

  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }

  // Kiểm tra tháng nhuận (đơn giản hoá để hiển thị)
  // Logic đầy đủ cần kiểm tra xem tháng hiện tại có phải nhuận không
  // Ở đây trả về cấu trúc cơ bản

  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    leap: 0, // Logic check leap chi tiết khá dài, tạm để 0 cho demo UI
  };
};

// --- Helper Can Chi ---
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
  const jd = jdFromDate(d, m, y);
  return `${TEN_CAN[(jd + 9) % 10]} ${TWELVE_CHI[(jd + 1) % 12]}`;
};

const getSafeDate = (year, month, day) => {
  const date = new Date(year, month, day);
  if (year >= 0 && year < 100) date.setFullYear(year);
  return date;
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

/* ===========================================================================
   PHẦN 2: UI COMPONENTS (CÓ DARK MODE & LIGHT MODE)
   ===========================================================================
*/

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Lấy isDark từ context để render đúng mode
  const { isDark, playClick } = useOutletContext();

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  const firstDateObj = getSafeDate(currentYear, currentMonth, 1);
  const firstDayOfMonth = firstDateObj.getDay();
  const startDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  // Handlers
  const handlePrevMonth = () => {
    if (playClick) playClick();
    setSelectedDate((prev) => {
      const prevMonth = prev.getMonth() - 1;
      let newYear = prev.getFullYear();
      let newMonth = prevMonth;
      if (prevMonth < 0) {
        newYear -= 1;
        newMonth = 11;
      }
      return getSafeDate(newYear, newMonth, 1);
    });
  };

  const handleNextMonth = () => {
    if (playClick) playClick();
    setSelectedDate((prev) => {
      const nextMonth = prev.getMonth() + 1;
      let newYear = prev.getFullYear();
      let newMonth = nextMonth;
      if (nextMonth > 11) {
        newYear += 1;
        newMonth = 0;
      }
      return getSafeDate(newYear, newMonth, 1);
    });
  };

  const handleToToday = () => {
    if (playClick) playClick();
    setSelectedDate(new Date());
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    setSelectedDate(getSafeDate(newYear, currentMonth, 1));
  };

  // Tính toán dữ liệu hiển thị (Dùng thuật toán chuẩn)
  const selectedLunar = convertSolar2Lunar(
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
    "Mã đáo thành công\nThuận buồm xuôi gió",
    "Gia đạo bình an\nHạnh phúc viên mãn",
    "Đắc tài đắc lộc\nĐắc nhân tâm",
    "Xuân dinh tứ hải\nMai khai ngũ phúc",
    "Trúc báo bình an\nTài già phú quý",
    "Khai trương hồng phát\nThần tài gõ cửa",
    "Sức khỏe dồi dào\nBách niên giai lão",
    "Cát tường như ý\nPhú quý vinh hoa",
    "Ngũ phúc lâm môn\nVận may gõ cửa",
    "Tình duyên phơi phới\nHạnh phúc đong đầy",
    "Công danh rộng mở\nSự nghiệp vững bền",
    "Tâm an vạn sự an\nLòng vui đời sẽ vui",
    "Hòa khí sinh tài\nAn cư lạc nghiệp",
    "Gieo nhân tốt\nGặt quả lành",
    "Vững chí bền gan\nẮt thành đại nghiệp",
    "Phúc như Đông Hải\nThọ tỷ Nam Sơn",
    "Trời thêm năm tháng\nNgười thêm thọ",
    "Xuân đến hoa cười\nLộc vào nhà biếc",
    "Ý chí kiên cường\nCon đường rộng mở",
    "Lộc biếc mai vàng\nXuân sang hạnh phúc",
    "Nhân nghĩa làm gốc\nPhú quý tự nhiên",
    "Đức năng thắng số\nNhân định thắng thiên",
    "Sống vui sống khỏe\nSống có ích",
    "Gia đình hòa thuận\nCon cháu thảo hiền",
    "Tâm sáng chí bền\nThành công sẽ đến",
    "Năm mới thắng lợi\nVạn sự hanh thông",
  ];
  const randomQuote = QUOTES[selectedDate.getDate() % QUOTES.length];

  // Colors config based on Dark Mode
  const theme = useMemo(() => {
    return isDark
      ? {
          bg: "bg-[#10182B]",
          card: "bg-[#1e1e1e]",
          text: "text-gray-100",
          subText: "text-gray-400",
          border: "border-white/10",
          gridHover: "hover:bg-white/5",
          selectedBg: "bg-red-900/40",
          selectedBorder: "border-red-500/50",
          paperBg: "bg-[#2a2a2a]",
          paperText: "text-gray-100",
          decorColor: "text-red-900/10",
        }
      : {
          bg: "bg-[#fdf6e3]",
          card: "bg-white",
          text: "text-gray-800",
          subText: "text-gray-500",
          border: "border-gray-100",
          gridHover: "hover:bg-gray-50",
          selectedBg: "bg-red-50",
          selectedBorder: "border-red-400",
          paperBg: "bg-white",
          paperText: "text-gray-800",
          decorColor: "text-red-100",
        };
  }, [isDark]);

  // Grid Render
  const renderGrid = useMemo(() => {
    const days = [];
    for (let i = 0; i < startDayOffset; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 md:h-24"></div>);
    }

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

      // Dùng hàm convert chuẩn
      const lunar = convertSolar2Lunar(i, currentMonth + 1, currentYear);
      const isTet = lunar.day === 1 && lunar.month === 1;
      const isSunday = date.getDay() === 0;

      // Text colors
      let solarTextColor = theme.text;
      if (isToday) solarTextColor = "bg-red-600 text-white shadow-md";
      else if (isSunday || isSelected) solarTextColor = "text-red-500";

      let lunarTextColor = theme.subText;
      if (lunar.day === 1 || lunar.day === 15)
        lunarTextColor = "text-red-500 font-semibold";

      days.push(
        <div
          key={i}
          onClick={() => {
            if (playClick) playClick();
            setSelectedDate(date);
          }}
          className={`
            relative h-16 md:h-24 border-t p-1 cursor-pointer transition-all duration-200 group
            flex flex-col items-center justify-start pt-2
            ${theme.border}
            ${isSelected ? `${theme.selectedBg} ${theme.selectedBorder} shadow-sm z-10` : theme.gridHover}
          `}
        >
          {/* Solar */}
          <span
            className={`text-lg font-playfair font-bold w-8 h-8 flex items-center justify-center rounded-full mb-1 transition-colors ${solarTextColor}`}
          >
            {i}
          </span>
          {/* Lunar */}
          <div className="flex flex-col items-center">
            <span
              className={`text-[10px] md:text-xs font-medium ${lunarTextColor}`}
            >
              {lunar.day === 1 ? `${lunar.day}/${lunar.month}` : lunar.day}
            </span>
            {lunar.day === 1 && (
              <span className="text-[8px] text-red-500 uppercase font-dancing mt-0.5">
                Sóc
              </span>
            )}
            {lunar.day === 15 && (
              <span className="text-[8px] text-red-500 uppercase font-dancing mt-0.5">
                Vọng
              </span>
            )}
            {isTet && (
              <span className="text-sm absolute bottom-1 right-1 animate-pulse">
                🌸
              </span>
            )}
          </div>
          {/* Border highlight for light mode */}
          {isSelected && !isDark && (
            <div className="absolute inset-0 border-2 border-red-400 pointer-events-none opacity-50 rounded-sm"></div>
          )}
        </div>,
      );
    }
    return days;
  }, [
    currentMonth,
    currentYear,
    selectedDate,
    startDayOffset,
    daysInMonth,
    theme,
    isDark,
    playClick,
  ]);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Playfair+Display:wght@400;700;900&family=Noto+Sans:wght@300;400;600&display=swap');
          .font-dancing { font-family: 'Dancing Script', cursive; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-noto { font-family: 'Noto Sans', sans-serif; }
        `}
      </style>

      <div
        className={`min-h-screen ${theme.bg} font-noto flex items-center justify-center p-4 md:p-8 transition-colors duration-300`}
      >
        <div
          className={`max-w-5xl w-full ${theme.card} rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border ${isDark ? "border-red-900/30" : "border-red-100"} transition-colors duration-300`}
        >
          {/* LEFT PANEL */}
          <div className="w-full bg-[#D00000] text-white p-6 flex flex-col items-center justify-between relative shrink-0 transition-colors">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="0" cy="0" r="100" fill="white" />
                <circle cx="200" cy="200" r="80" fill="#FFD700" />
              </svg>
            </div>

            <div className="relative z-10 w-full text-center mt-2">
              <h2 className="text-2xl font-playfair font-bold text-yellow-300 uppercase tracking-widest border-b border-white/20 pb-2 mx-10">
                Tháng {selectedDate.getMonth() + 1}
              </h2>
              <div className="text-sm font-light text-white/80 mt-1 uppercase tracking-wider">
                Năm {selectedDate.getFullYear()}
              </div>
            </div>

            {/* Paper Strip */}
            <div
              className={`relative z-10 w-[240px] ${theme.paperBg} ${theme.paperText} rounded-[3rem] shadow-[0_10px_30px_rgba(0,0,0,0.4)] my-6 flex flex-col items-center py-8 px-4 overflow-hidden transition-colors duration-300`}
            >
              <div className="absolute -top-3 w-4 h-4 bg-[#D00000] rounded-full shadow-inner"></div>
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
                <span className="text-[140px] leading-none font-playfair font-black text-[#D00000] tracking-tighter drop-shadow-sm">
                  {selectedDate.getDate()}
                </span>
              </div>
              <div
                className={`w-16 border-t-2 border-dashed ${isDark ? "border-gray-600" : "border-gray-300"} my-4`}
              ></div>

              <div className="flex flex-col items-center">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
                  Âm Lịch
                </span>
                <div className="flex items-baseline space-x-1">
                  <span
                    className={`text-4xl font-bold font-playfair ${theme.paperText}`}
                  >
                    {selectedLunar.day}
                  </span>
                  <span className="text-lg font-light text-gray-500">
                    / {selectedLunar.month}
                  </span>
                </div>
                <span className="text-xl font-dancing text-[#D00000] mt-1">
                  {canChiDay}
                </span>
              </div>
            </div>

            <div className="relative z-10 text-center w-full">
              <div className="inline-block px-6 py-2 border border-yellow-400/50 rounded-full bg-[#a30000]/30 text-yellow-300 font-playfair mb-4 shadow-sm backdrop-blur-sm">
                Năm {canChiYear}
              </div>
              <p className="font-dancing text-xl text-white/90 whitespace-pre-line leading-relaxed italic drop-shadow-md">
                "{randomQuote}"
              </p>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div
            className={`flex-1 p-6 md:p-8 ${theme.card} relative transition-colors duration-300`}
          >
            {/* Header Nav */}
            <div
              className={`flex items-center justify-between mb-8 pb-4 border-b ${theme.border}`}
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleToToday}
                  className={`p-2 rounded-full transition-colors ${isDark ? "text-red-400 hover:bg-white/10" : "text-red-600 hover:bg-red-50"}`}
                >
                  <RotateCcw size={20} />
                </button>
                <div className="flex items-baseline font-playfair">
                  <span
                    className={`text-3xl font-bold ${theme.text} mr-2 transition-colors`}
                  >
                    Tháng {currentMonth + 1}
                  </span>
                  <div className="relative group">
                    <select
                      value={currentYear}
                      onChange={handleYearChange}
                      className={`appearance-none bg-transparent text-xl font-medium cursor-pointer focus:outline-none pr-4 hover:text-red-500 transition-colors ${theme.subText}`}
                    >
                      {[...Array(100)].map((_, i) => {
                        const y = currentYear - 50 + i;
                        return (
                          <option key={y} value={y} className="text-gray-800">
                            {y}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex space-x-1">
                <button
                  onClick={handlePrevMonth}
                  className={`p-2 rounded-full transition-colors ${isDark ? "text-gray-400 hover:bg-white/10 hover:text-red-400" : "text-gray-600 hover:bg-gray-100 hover:text-red-600"}`}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNextMonth}
                  className={`p-2 rounded-full transition-colors ${isDark ? "text-gray-400 hover:bg-white/10 hover:text-red-400" : "text-gray-600 hover:bg-gray-100 hover:text-red-600"}`}
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
                  className={`text-center text-sm font-bold uppercase pb-2 ${idx === 6 ? "text-red-600" : theme.subText}`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7">{renderGrid}</div>

            {/* Legend */}
            <div
              className={`mt-8 flex flex-wrap gap-6 text-xs ${theme.subText} border-t ${theme.border} pt-4`}
            >
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
                <span>Hôm nay</span>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 border mr-2 ${isDark ? "bg-red-900/40 border-red-500/50" : "bg-red-50 border-red-500"}`}
                ></div>
                <span>Đang chọn</span>
              </div>
              <div className="flex items-center">
                <span className="text-red-500 font-bold mr-1">1/1</span>
                <span>Sóc</span>
              </div>
              <div className="flex items-center">
                <span className="text-red-500 font-bold mr-1">15/1</span>
                <span>Vọng</span>
              </div>
            </div>

            {/* Decor SVG */}
            <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-50">
              <svg
                viewBox="0 0 100 100"
                className={`w-full h-full fill-current ${theme.decorColor}`}
              >
                <path d="M100 0 Q 50 50 100 100 L 100 0" />
                <circle
                  cx="80"
                  cy="20"
                  r="5"
                  className={isDark ? "text-yellow-600/20" : "text-yellow-200"}
                />
                <circle
                  cx="90"
                  cy="50"
                  r="8"
                  className={isDark ? "text-yellow-600/20" : "text-yellow-200"}
                />
              </svg>
            </div>
          </div>
        </div>
        <div
          className={`fixed bottom-2 w-full text-center text-[10px] ${theme.subText} opacity-60`}
        >
          Lịch Vạn Niên • Tính toán theo thuật toán thiên văn
        </div>
      </div>
    </>
  );
};

export default Calendar;
