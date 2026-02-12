import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Incense from "./pages/Incense";
import Prayer from "./pages/Prayer";
import Fortune from "./pages/Fortune";
import LuckyMoney from "./pages/LuckyMoney";
import Calligraphy from "./pages/Calligraphy";
import Donation from "./pages/Donation";
import Calendar from "./pages/Calendar";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("temple_user_2026");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!user) {
    return <Onboarding onComplete={setUser} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout user={user} setUser={setUser} />}>
          <Route index element={<Home />} />
          <Route path="incense" element={<Incense />} />
          <Route path="prayer" element={<Prayer />} />
          <Route path="fortune" element={<Fortune />} />
          <Route path="lucky" element={<LuckyMoney />} />
          <Route path="calligraphy" element={<Calligraphy />} />
          <Route path="donation" element={<Donation />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
