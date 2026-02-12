import React, { useState } from "react";

const Onboarding = ({ onComplete }) => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && dob) {
      const userData = { name, dob };
      localStorage.setItem("temple_user_2026", JSON.stringify(userData));
      onComplete(userData);
    }
  };

  return (
    <div className="min-h-screen bg-red-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-30"></div>
      <div className="bg-[#fffdf5] p-8 rounded-2xl shadow-2xl max-w-md w-full border-4 border-yellow-600 relative z-10">
        <div className="text-center mb-6">
          <div className="mx-auto w-24 h-24 bg-red-800 rounded-full flex items-center justify-center mb-4 border-4 border-yellow-500 shadow-lg">
            <span className="text-5xl">🐎</span>
          </div>
          <h1 className="text-4xl font-bold text-red-800 font-calligraphy mb-2">
            Chùa Online
          </h1>
          <p className="text-yellow-800 font-serif font-bold text-lg">
            Xuân Bính Ngọ 2026
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-red-800 font-serif font-bold mb-1">
              Họ và Tên
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border-2 border-yellow-400 rounded-lg focus:outline-none focus:border-red-600 bg-white font-serif text-lg"
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-red-800 font-serif font-bold mb-1">
              Ngày sinh
            </label>
            <input
              type="date"
              required
              className="w-full p-3 border-2 border-yellow-400 rounded-lg focus:outline-none focus:border-red-600 bg-white font-serif"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-700 text-yellow-100 font-bold py-3 rounded-lg hover:bg-red-800 transition transform hover:scale-105 shadow-lg border-b-4 border-red-900 font-serif text-xl"
          >
            Nhập Cửa Chùa
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
