import React from "react";
import s from "./ProfilePopup.module.css";
import { getUser, clearAuth } from "../../lib/auth";
import { useNavigate } from "react-router-dom";

export default function ProfilePopup({ onClose }) {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.popup} onClick={(e) => e.stopPropagation()}>
        <h3>Профиль пользователя</h3>
        <p className={s.name}>{user?.email || "Неизвестный пользователь"}</p>

        <div className={s.actions}>
          <button className={s.logout} onClick={handleLogout}>
            Выйти
          </button>
          <button className={s.close} onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
