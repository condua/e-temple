import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { HeartHandshake, QrCode, Copy, Check, ChevronLeft } from "lucide-react";
import { useAudio } from "../hooks/useAudio";
import { SOUNDS } from "../data/constants";

// CẤU HÌNH TÀI KHOẢN NGÂN HÀNG (Thay thông tin của bạn vào đây)
const BANK_INFO = {
  bankId: "VIKKI", // Mã ngân hàng (MB, VCB, TPB, v.v.)
  accountNo: "399915548", // Số tài khoản
  accountName: "Phan Hoàng Phúc", // Tên chủ tài khoản
  template: "compact", // Kiểu QR (compact, print, qr_only)
};

const Donation = () => {
  const { isDark, playClick } = useOutletContext();
  const [step, setStep] = useState(1); // 1: Chọn tiền, 2: Hiện QR, 3: Cảm ơn
  const [amount, setAmount] = useState(0); // Số tiền
  const [customAmount, setCustomAmount] = useState(""); // Input nhập tay
  const [isCustom, setIsCustom] = useState(false); // Trạng thái đang chọn "Tùy tâm"
  const [copied, setCopied] = useState(false); // Trạng thái copy STK

  const successSound = useAudio(SOUNDS.success); // Âm thanh gõ chuông/thành công

  // Hàm format tiền tệ (VD: 10,000)
  const formatCurrency = (val) => {
    if (!val) return "";
    return new Intl.NumberFormat("vi-VN").format(val);
  };

  // Xử lý khi chọn mệnh giá có sẵn
  const selectPreset = (val) => {
    playClick();
    setAmount(val);
    setIsCustom(false);
    setCustomAmount("");
    setStep(2); // Chuyển sang trang QR ngay
  };

  // Xử lý khi bấm "Tùy tâm"
  const selectCustom = () => {
    playClick();
    setIsCustom(true);
    setAmount(0);
  };

  // Xử lý khi bấm "Tạo QR" từ ô nhập tay
  const submitCustom = () => {
    playClick();
    const val = parseInt(customAmount.replace(/\D/g, ""), 10);
    if (!val || val < 1000) {
      alert("Vui lòng nhập số tiền hợp lệ (tối thiểu 1.000đ)");
      return;
    }
    setAmount(val);
    setStep(2);
  };

  // Hoàn tất chuyển khoản
  const handleFinish = () => {
    playClick();
    successSound.playOneShot();
    setStep(3);
  };

  // Copy số tài khoản
  const handleCopy = () => {
    navigator.clipboard.writeText(BANK_INFO.accountNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Link tạo QR tự động từ VietQR (Dịch vụ miễn phí)
  const qrUrl = `https://img.vietqr.io/image/${BANK_INFO.bankId}-${BANK_INFO.accountNo}-${BANK_INFO.template}.png?amount=${amount}&addInfo=CONG DUC&accountName=${encodeURIComponent(BANK_INFO.accountName)}`;

  return (
    <div className="h-screen w-full flex flex-col items-center p-4 md:p-6 overflow-y-auto">
      {/* HEADER: Hòm công đức (Luôn hiện ở Bước 1 & 2) */}
      {step < 3 && (
        <div className="text-center mb-6 animate-fade-in">
          <div className="w-24 h-24 mx-auto bg-red-900 rounded-lg border-4 border-yellow-500 mb-4 flex items-center justify-center shadow-xl relative group">
            <div className="w-12 h-1.5 bg-black opacity-40 rounded-full shadow-inner"></div>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-yellow-500 rounded-t-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[10px] font-bold text-red-900">
                Gieo duyên
              </span>
            </div>
            <span className="absolute text-yellow-400 font-bold font-serif top-2 uppercase tracking-widest text-xs">
              Công Đức
            </span>
            <div className="absolute bottom-1 text-yellow-600/70 text-[10px] font-serif">
              PHƯỚC LÀNH
            </div>
          </div>
          <h2
            className={`text-3xl font-bold font-calligraphy ${isDark ? "text-yellow-400" : "text-red-800"}`}
          >
            Hòm Công Đức
          </h2>
          <p
            className={`text-sm italic font-serif mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            "Tùy hỷ phát tâm, phước báu vô lượng"
          </p>
        </div>
      )}

      {/* --- BƯỚC 1: CHỌN SỐ TIỀN --- */}
      {step === 1 && (
        <div className="w-full max-w-sm animate-zoom-in">
          <div className="grid grid-cols-2 gap-4 font-serif mb-6">
            {[
              1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000,
              1000000,
            ].map((val) => (
              <button
                key={val}
                onClick={() => selectPreset(val)}
                className="py-4 bg-green-50 text-green-900 rounded-xl border border-green-200 hover:bg-green-100 hover:border-green-400 font-bold shadow-sm transition active:scale-95 flex flex-col items-center"
              >
                <span className="text-lg">{formatCurrency(val)}đ</span>
                <span className="text-xs font-normal opacity-70">Gieo lộc</span>
              </button>
            ))}
          </div>

          {/* Nút Tùy tâm */}
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-yellow-200 shadow-sm">
            <button
              onClick={selectCustom}
              className={`w-full py-3 rounded-lg font-bold transition border-2 ${
                isCustom
                  ? "bg-yellow-100 border-yellow-500 text-yellow-900"
                  : "bg-gray-100 border-transparent text-gray-600 hover:bg-gray-200"
              }`}
            >
              Tùy tâm (Nhập số khác)
            </button>

            {/* Input hiện ra khi chọn Tùy tâm */}
            {isCustom && (
              <div className="mt-4 animate-fade-in-down">
                <div className="relative">
                  <input
                    type="text"
                    value={
                      customAmount
                        ? Number(customAmount).toLocaleString("vi-VN")
                        : ""
                    }
                    onChange={(e) => {
                      // Chỉ lấy số từ input
                      const rawValue = e.target.value.replace(/\D/g, "");
                      setCustomAmount(rawValue);
                    }}
                    placeholder="0"
                    className="w-full pl-4 pr-12 py-3 text-right text-xl font-bold text-red-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                    đ
                  </span>
                </div>
                <button
                  onClick={submitCustom}
                  className="w-full mt-3 py-3 bg-red-800 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition active:scale-95 uppercase tracking-wide flex items-center justify-center gap-2"
                >
                  <QrCode size={18} /> Tạo mã QR
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- BƯỚC 2: QUÉT QR --- */}
      {step === 2 && (
        <div className="w-full max-w-sm animate-slide-up flex flex-col items-center pb-20">
          <div className="bg-white p-4 rounded-2xl shadow-2xl border-2 border-yellow-400 relative w-full">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-5 pointer-events-none rounded-2xl"></div>

            <div className="text-center mb-4">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">
                Quét mã để chuyển khoản
              </p>
              <p className="text-2xl font-bold text-red-800">
                {formatCurrency(amount)} VNĐ
              </p>
            </div>

            {/* Ảnh QR */}
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 border border-gray-200">
              <img
                src={qrUrl}
                alt="QR Chuyen khoan"
                className="w-full h-full object-contain p-2"
                loading="lazy"
              />
            </div>

            {/* Thông tin Text (Dự phòng nếu không quét được) */}
            <div className="bg-gray-50 rounded-lg p-3 text-left space-y-2 text-sm border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Ngân hàng:</span>
                <span className="font-bold text-gray-800">
                  {BANK_INFO.bankId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Chủ TK:</span>
                <span className="font-bold text-gray-800 uppercase">
                  {BANK_INFO.accountName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Số TK:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-700 text-base">
                    {BANK_INFO.accountNo}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-100 transition"
                    title="Sao chép"
                  >
                    {copied ? (
                      <Check size={14} className="text-green-600" />
                    ) : (
                      <Copy size={14} className="text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full mt-6">
            <button
              onClick={() => {
                playClick();
                setStep(1);
              }}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition"
            >
              <ChevronLeft className="inline w-5 h-5 mb-1" /> Quay lại
            </button>
            <button
              onClick={handleFinish}
              className="flex-[2] py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-lg shadow-lg transition active:scale-95"
            >
              Đã chuyển khoản
            </button>
          </div>
        </div>
      )}

      {/* --- BƯỚC 3: CẢM ƠN --- */}
      {step === 3 && (
        <div className="flex-1 flex flex-col items-center justify-center animate-zoom-in text-center p-4">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-30 rounded-full animate-pulse"></div>
            <HeartHandshake size={100} className="text-red-600 relative z-10" />
            <div className="absolute -top-2 -right-2 text-yellow-500 animate-bounce">
              ✨
            </div>
          </div>

          <h2 className="text-4xl font-bold font-calligraphy text-red-600 mb-4 drop-shadow-sm">
            Công Đức Vô Lượng
          </h2>

          <p
            className={`mb-2 font-serif text-lg ${isDark ? "text-gray-200" : "text-gray-800"}`}
          >
            Nhà chùa xin ghi nhận tấm lòng vàng của thí chủ.
          </p>
          <p className="text-gray-500 italic font-serif text-sm mb-8">
            Cầu chúc thí chủ một năm mới an khang, thịnh vượng.
          </p>

          <button
            onClick={() => {
              playClick();
              setStep(1);
              setAmount(0);
              setDonated(false); // Reset nếu component cha có dùng
            }}
            className="px-8 py-3 border-2 border-red-800 text-red-800 hover:bg-red-50 rounded-full font-bold transition font-serif uppercase tracking-widest"
          >
            Về trang chủ
          </button>
        </div>
      )}
    </div>
  );
};

export default Donation;
