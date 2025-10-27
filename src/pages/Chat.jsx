import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header/Header";
import BottomNav from "../components/BottomNav/BottomNav";
import s from "./Chat.module.css";
import { getToken } from "../lib/auth";
import { askScoring } from "../api";

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Привет! Я ваш ассистент SmartCredit. Чем могу помочь сегодня?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const boxRef = useRef(null);
  const recognitionRef = useRef(null);

  // ===== Автопрокрутка =====
  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages, loading]);

  // ===== Голосовой ввод =====
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Ваш браузер не поддерживает голосовой ввод");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "ru-RU";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e);
      setListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setTimeout(sendQuery, 500);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // ===== Отправка запроса =====
  const sendQuery = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);

    try {
      const data = await askScoring(text, getToken());
      setMessages((m) => [...m, { role: "assistant", content: data.answer }]);
    } catch (err) {
      console.error("Ошибка API:", err);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Произошла ошибка при обращении к серверу 😔" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ===== Быстрые кнопки =====
  const quick = (q) => {
    setInput(q);
    setTimeout(sendQuery, 0);
  };

  return (
    <div className="page">
      <Header title="Поддержка" />

      <div className={s.header}>
        <div className={s.botAvatar}><i className="fas fa-robot" /></div>
        <div className={s.title}>SmartCredit ассистент</div>
        <div className={s.subtitle}>Задайте вопрос — я рядом</div>
      </div>

      <div ref={boxRef} className={s.chatBox}>
        {/* приветствие + быстрые кнопки */}
        {messages.length === 1 && (
          <div className={`${s.msg} ${s.bot}`}>
            Привет! Я могу рассказать о кредитах, скоринге и финансовых советах.
            <div className={s.time}>сейчас</div>
            <div className={s.quick}>
              <button onClick={() => quick("Хочу взять кредит 5000000 тенге на машину")}>
                Кредит
              </button>
              <button onClick={() => quick("Как улучшить кредитную историю?")}>
                Кредитная история
              </button>
              <button onClick={() => quick("Какие условия для ипотеки?")}>
                Ипотека
              </button>
              <button onClick={() => quick("Рассчитай мой скоринг")}>
                Скоринг
              </button>
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`${s.msg} ${m.role === "user" ? s.user : s.bot}`}>
            {m.content}
          </div>
        ))}

        {loading && (
          <div className={s.typing}>
            <div className={s.dot}></div>
            <div className={s.dot}></div>
            <div className={s.dot}></div>
          </div>
        )}
      </div>

      <div className={s.inputBar}>
        <button onClick={startListening} className={s.micBtn}>
          <i className={`fas fa-microphone ${listening ? s.micActive : ""}`} />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendQuery()}
          placeholder="Введите сообщение…"
        />
        <button onClick={sendQuery}>
          <i className="fas fa-paper-plane" />
        </button>
      </div>

      <BottomNav active="chat" />
    </div>
  );
}
