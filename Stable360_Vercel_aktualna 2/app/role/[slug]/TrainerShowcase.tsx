"use client";

import { useState, type FormEvent } from "react";
import { CalendarDays, Check, ChevronRight, Clock3, Magnet, MapPin, Plus, Repeat2, StickyNote, Trophy, Users, X } from "lucide-react";

import TrainerCompetitionsApp from "./TrainerCompetitionsApp";
import TrainerHorsesApp from "./TrainerHorsesApp";

const weekdays = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
const trainers = [
  { name: "Anna Nowak", available: true },
  { name: "Michał Kowalski", available: false },
];

export function TrainingBookingApp({ additionalHorses = [] }: { additionalHorses?: string[] } = {}) {
  const [open, setOpen] = useState(true);
  const [saved, setSaved] = useState(false);
  const [stable, setStable] = useState("Małe ufoludki");
  const [date, setDate] = useState("2026-10-16");
  const [time, setTime] = useState("08:00");
  const [duration, setDuration] = useState("60 min");
  const [place, setPlace] = useState("Bez miejsca");
  const [availableOnly, setAvailableOnly] = useState(true);
  const [trainer, setTrainer] = useState("Anna Nowak");
  const [horse, setHorse] = useState("");
  const [rider, setRider] = useState("Bez jeźdźca");
  const [repeat, setRepeat] = useState(true);
  const [frequency, setFrequency] = useState("1 tydzień");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState<number[]>([4]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trainers.some((item) => item.name === trainer && item.available)) {
      setError("Wybrany trener jest niedostępny. Wybierz innego trenera.");
      return;
    }
    if (repeat && days.length === 0) {
      setError("Wybierz co najmniej jeden dzień tygodnia.");
      return;
    }
    setError("");
    setSaved(true);
    setOpen(false);
  }

  function toggleDay(day: number) {
    setDays((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day]);
    setError("");
  }

  const dateLabel = date ? new Date(`${date}T12:00:00`).toLocaleDateString("pl-PL") : "";

  return <div className="owner-module-app trainer-booking-app">
    <header className="trainer-booking-header">
      {open ? <button type="button" aria-label="Zamknij formularz treningu" onClick={() => setOpen(false)}><X /></button> : <span />}
      <b>{open ? "Dodaj trening ręcznie" : "Umawianie treningów"}</b>
      <span />
    </header>
    {open ? <form className="trainer-booking-scroll" onSubmit={submit}>
      <fieldset className="trainer-booking-section">
        <legend>1. Gdzie i kiedy?</legend>
        <label><span>Stajnia</span><select value={stable} onChange={(event) => setStable(event.target.value)}><option>Małe ufoludki</option><option>Stajnia Brzozowa</option></select></label>
        <label><span>Data</span><input type="date" required value={date} onChange={(event) => setDate(event.target.value)} /></label>
        <label><span>Godzina rozpoczęcia</span><input type="time" required value={time} onChange={(event) => setTime(event.target.value)} /></label>
        <label><span>Czas trwania</span><select value={duration} onChange={(event) => setDuration(event.target.value)}>{["30 min", "45 min", "60 min", "90 min"].map((value) => <option key={value}>{value}</option>)}</select></label>
        <label><span>Miejsce / Przestrzeń</span><select value={place} onChange={(event) => setPlace(event.target.value)}><option>Bez miejsca</option><option>Ujeżdżalnia</option><option>Plac zewnętrzny</option></select></label>
      </fieldset>
      <fieldset className="trainer-booking-section">
        <legend>2. Kto?</legend>
        <div className="trainer-booking-switch-row"><span>Pokaż tylko dostępnych</span><button type="button" role="switch" aria-label="Pokaż tylko dostępnych trenerów" aria-checked={availableOnly} className={availableOnly ? "on" : ""} onClick={() => { setAvailableOnly((current) => !current); if (!availableOnly && trainer === "Michał Kowalski") setTrainer(""); }}><i /></button></div>
        <label><span>Trener</span><select required value={trainer} onChange={(event) => setTrainer(event.target.value)}><option value="">Wybierz trenera</option>{trainers.filter((item) => !availableOnly || item.available).map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
        {trainer === "Michał Kowalski" ? <p className="trainer-booking-hint">Ten trener nie jest dostępny w wybranym terminie. Wybierz innego trenera lub zmień termin.</p> : null}
        <label><span>Koń</span><select required value={horse} onChange={(event) => setHorse(event.target.value)}><option value="">Wybierz konia</option>{Array.from(new Set(["Luna", "Misiu", "Casper", ...additionalHorses])).map((horseName) => <option key={horseName}>{horseName}</option>)}</select></label>
        <label><span>Jeździec</span><select value={rider} onChange={(event) => setRider(event.target.value)}><option>Bez jeźdźca</option><option>Michalina</option><option>Julia</option></select></label>
      </fieldset>
      <fieldset className="trainer-booking-section">
        <legend>3. Ustawienia powtarzania <small>(opcjonalnie)</small></legend>
        <div className="trainer-booking-switch-row"><span>Powtarzaj trening</span><button type="button" role="switch" aria-label="Powtarzaj trening" aria-checked={repeat} className={repeat ? "on" : ""} onClick={() => { setRepeat((current) => !current); setError(""); }}><i /></button></div>
        {repeat ? <>
          <label><span>Powtarzaj co</span><select value={frequency} onChange={(event) => setFrequency(event.target.value)}>{["1 tydzień", "2 tygodnie", "3 tygodnie", "4 tygodnie"].map((value) => <option key={value}>{value}</option>)}</select></label>
          <label><span>Do dnia</span><input type="date" required min={date} value={endDate} onChange={(event) => setEndDate(event.target.value)} /></label>
          <div className="trainer-booking-days"><span>Dni tygodnia</span><div role="group" aria-label="Dni powtarzania treningu">{weekdays.map((day, index) => <button key={day} type="button" aria-pressed={days.includes(index)} className={days.includes(index) ? "active" : ""} onClick={() => toggleDay(index)}>{day}</button>)}</div></div>
          {!endDate ? <p className="trainer-booking-hint">Wybierz datę zakończenia, aby zapisać powtarzanie.</p> : null}
        </> : null}
      </fieldset>
      <fieldset className="trainer-booking-section">
        <legend>4. Notatka dla trenera <small>(opcjonalnie)</small></legend>
        <label className="trainer-booking-note"><span className="trainer-visually-hidden">Notatka dla trenera</span><textarea maxLength={200} placeholder="np. Uwaga na linię 5 przeszkód, trudniejszy okser…" value={note} onChange={(event) => setNote(event.target.value)} /><small>{note.length}/200</small></label>
      </fieldset>
      {error ? <p className="trainer-booking-error" role="alert">{error}</p> : null}
      <div className="trainer-booking-submit"><button type="submit" className="owner-primary">Dodaj trening <ChevronRight /></button><small>Dane przykładowe · interaktywny podgląd</small></div>
    </form> : <div className="trainer-booking-overview">
      {saved ? <>
        <div className="trainer-booking-success" role="status"><Check /><b>Trening zaplanowany</b><span>Tak wygląda podsumowanie w podglądzie.</span></div>
        <article><b>{horse} · {trainer}</b><span><CalendarDays />{dateLabel} · {time}</span><span><Clock3 />{duration}</span><span><MapPin />{stable} · {place}</span>{rider !== "Bez jeźdźca" ? <span><Users />{rider}</span> : null}{repeat ? <span><Repeat2 />Co {frequency} · {days.slice().sort().map((day) => weekdays[day]).join(", ")} · do {new Date(`${endDate}T12:00:00`).toLocaleDateString("pl-PL")}</span> : null}{note ? <p>{note}</p> : null}</article>
      </> : <div className="trainer-booking-empty"><CalendarDays /><b>Zaplanuj kolejny trening</b><span>Wybierz termin, konia i uczestników.</span></div>}
      <button type="button" className="owner-primary" onClick={() => { setSaved(false); setOpen(true); }}><Plus />{saved ? "Zaplanuj kolejny trening" : "Dodaj trening"}</button>
      <small className="trainer-booking-demo-note">Podgląd demonstracyjny — bez zapisu w aplikacji.</small>
    </div>}
  </div>;
}

export default function TrainerShowcase() {
  const [active, setActive] = useState<"booking" | "competitions" | "horses">("booking");
  const [addedHorses, setAddedHorses] = useState<string[]>([]);
  const isBooking = active === "booking";
  const Icon = isBooking ? CalendarDays : active === "competitions" ? Trophy : Magnet;
  const title = isBooking ? "Umawianie treningów" : active === "competitions" ? "Zawody" : "Moje konie";
  const features = isBooking ? [
    { icon: MapPin, label: "Stajnia, termin i miejsce" },
    { icon: Users, label: "Trener, koń i jeździec" },
    { icon: Repeat2, label: "Trening jednorazowy lub cykliczny" },
    { icon: StickyNote, label: "Notatka dla trenera" },
  ] : active === "competitions" ? [
    { icon: Trophy, label: "Konfiguracja zawodów i limit zapisów" },
    { icon: CalendarDays, label: "Termin i miejsce wydarzenia" },
    { icon: Users, label: "Uczestnicy i statusy zapisów" },
    { icon: StickyNote, label: "Komunikaty i archiwum zawodów" },
  ] : [
    { icon: Magnet, label: "Imię konia i opcjonalny pseudonim" },
    { icon: Users, label: "Przypisanie właściciela po zapisaniu" },
    { icon: CalendarDays, label: "Koń dostępny przy umawianiu treningu" },
  ];
  return <div className="owner-horse-showcase owner-modules-showcase trainer-showcase">
    <aside className="trainer-feature-copy">
      <small>W TWOJEJ ROLI</small>
      <div className="trainer-module-picker" role="group" aria-label="Moduły trenera">
        <button type="button" className={isBooking ? "active" : ""} aria-pressed={isBooking} onClick={() => setActive("booking")}><CalendarDays /><span><b>Umawianie treningów</b><small>Terminy, uczestnicy i powtarzanie.</small></span></button>
        <button type="button" className={active === "competitions" ? "active" : ""} aria-pressed={active === "competitions"} onClick={() => setActive("competitions")}><Trophy /><span><b>Zawody</b><small>Organizacja, zapisy i komunikaty.</small></span></button>
        <button type="button" className={active === "horses" ? "active" : ""} aria-pressed={active === "horses"} onClick={() => setActive("horses")}><Magnet /><span><b>Moje konie</b><small>Lista koni i prosty formularz dodawania.</small></span></button>
      </div>
      <h3>{title}</h3>
      <p>{isBooking ? "Ustal termin, wybierz uczestników i uporządkuj treningi w jednym formularzu." : active === "competitions" ? "Zaplanuj zawody, określ zasady zapisów i zbierz najważniejsze informacje w jednym miejscu." : "Dodaj konia, podając tylko imię i opcjonalny pseudonim. Pozostałe informacje można uzupełnić później."}</p>
      <ul>{features.map(({ icon: FeatureIcon, label }) => <li key={label}><FeatureIcon /><span>{label}</span></li>)}</ul>
    </aside>
    <div className="owner-phone-wrap"><div className="owner-phone-label"><Icon /><span><small>INTERAKTYWNY PODGLĄD TRENERA</small><b>{title}</b></span></div><div className="mockup-phone"><div className="mockup-phone-notch" /><div className="trainer-module-panel" hidden={!isBooking}><TrainingBookingApp additionalHorses={addedHorses} /></div><div className="trainer-module-panel" hidden={active !== "competitions"}><TrainerCompetitionsApp /></div><div className="trainer-module-panel" hidden={active !== "horses"}><TrainerHorsesApp onHorseAdded={(horseName) => setAddedHorses((current) => [...current, horseName])} /></div></div></div>
  </div>;
}
