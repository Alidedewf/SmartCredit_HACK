import React, { useState } from "react";
import s from "./Header.module.css";
import ProfilePopup from "../ProfilePopup/ProfilePopup";

export default function Header({ title, balance }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <header className={s.header}>
      <div className={s.logo}>{title ?? balance ?? "My Bank"}</div>

      <div className={s.profile} onClick={() => setShowPopup(!showPopup)}>
        <i className="fas fa-user" />
      </div>

      {showPopup && <ProfilePopup onClose={() => setShowPopup(false)} />}
    </header>
  );
}
