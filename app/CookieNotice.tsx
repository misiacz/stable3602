"use client";

import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "stable360:cookie-notice:v1";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(STORAGE_KEY) !== "acknowledged");
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "acknowledged");
    } catch {
      // The notice can still be dismissed when browser storage is unavailable.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <section className="cookie-notice" aria-labelledby="cookie-notice-title" aria-describedby="cookie-notice-description">
      <span className="cookie-notice-icon" aria-hidden="true"><Cookie /></span>
      <div className="cookie-notice-copy">
        <h2 id="cookie-notice-title">Pliki cookies</h2>
        <p id="cookie-notice-description">Korzystamy z niezbędnych plików cookies, aby strona działała prawidłowo. Potwierdzenie komunikatu zapamiętamy w tej przeglądarce.</p>
      </div>
      <button type="button" onClick={dismiss}>Rozumiem</button>
    </section>
  );
}
