import React, { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import BalanceCard from "../components/BalanceCard/BalanceCard";
import StatsSection from "../components/StatsSection/StatsSection";
import ActivitySection from "../components/ActivitySection/ActivitySection";
import BottomNav from "../components/BottomNav/BottomNav";

export default function Home() {
  const [balance, setBalance] = useState("452,780 ₸");
  const [showModal, setShowModal] = useState(false);

  const updateBalance = () => {
    setBalance("453,120 ₸");
    setTimeout(() => setBalance("452,780 ₸"), 2000);
  };

  return (
    <div className="page">
      <Header balance={balance} />
      <BalanceCard balance={balance} onClick={updateBalance} />
      <StatsSection />
      <ActivitySection />
      <BottomNav active="home" />
      {showModal && (
        <div
          style={{
            background: "rgba(0,0,0,0.8)",
            color: "white",
            textAlign: "center",
            padding: "20px",
            borderRadius: "12px",
            margin: "20px",
          }}
        >
          <h3>Заполните профиль</h3>
          <p>Ваши финансовые данные пока не указаны.</p>
          <button
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              borderRadius: "8px",
              background: "#21aec4",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => setShowModal(false)}
          >
            Закрыть
          </button>
        </div>
      )}
    </div>
  );
}
