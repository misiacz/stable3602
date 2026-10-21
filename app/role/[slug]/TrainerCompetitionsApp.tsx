"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import { Archive, ArrowLeft, Award, CalendarDays, Check, ChevronRight, Clock3, Flag, Gem, MapPin, Megaphone, Plus, Star, Trash2, Trophy, Users, X } from "lucide-react";

const iconOptions = [
  { id: "trophy", label: "Puchar", icon: Trophy },
  { id: "award", label: "Medal", icon: Award },
  { id: "star", label: "Gwiazda", icon: Star },
  { id: "gem", label: "Diament", icon: Gem },
  { id: "calendar", label: "Kalendarz", icon: CalendarDays },
  { id: "flag", label: "Flaga", icon: Flag },
] as const;
type IconId = (typeof iconOptions)[number]["id"];
type Notification = "all" | "selected" | "none";
const colors = ["#7c20dd", "#3555d5", "#c46c28", "#4f873b", "#b82942", "#169c86", "#c92380", "#77717b"];
const people = ["Michalina", "Julia", "Anna"];
const statisticItems = [{ icon: Users, label: "zapisanych" }, { icon: Check, label: "potwierdzonych" }, { icon: Clock3, label: "oczekujących" }, { icon: X, label: "anulowanych" }];
type Competition = {
  id: number; name: string; icon: IconId; color: string;
  start: string; end: string; place: string; capacity: string;
  notification: Notification; recipients: string[]; archived: boolean;
  messages: { id: number; text: string }[];
};
type CompetitionDraft = Omit<Competition, "id" | "archived" | "messages">;

function EventIcon({ id }: { id: IconId }) {
  const Icon = iconOptions.find((item) => item.id === id)?.icon ?? Trophy;
  return <Icon aria-hidden="true" />;
}

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
}

function ConfigureCompetition({ onSave, onCancel }: { onSave: (draft: CompetitionDraft) => void; onCancel: () => void }) {
  const [icon, setIcon] = useState<IconId>("trophy");
  const [color, setColor] = useState(colors[1]);
  const [name, setName] = useState("");
  const [start, setStart] = useState("2026-10-16");
  const [end, setEnd] = useState("2026-10-16");
  const [place, setPlace] = useState("");
  const [capacity, setCapacity] = useState("");
  const [notification, setNotification] = useState<Notification>("all");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) { setError("Podaj nazwę zawodów."); return; }
    if (end < start) { setError("Data zakończenia nie może być wcześniejsza od rozpoczęcia."); return; }
    if (notification === "selected" && recipients.length === 0) { setError("Wybierz osoby do powiadomienia."); return; }
    onSave({ icon, color, name: name.trim(), start, end, place: place.trim(), capacity, notification, recipients: notification === "selected" ? recipients : [] });
  }

  return <>
    <header className="trainer-booking-header competition-config-header"><button type="button" aria-label="Zamknij konfigurację zawodów" onClick={onCancel}><X /></button><b>Konfiguruj zawody</b><span /></header>
    <form className="competition-config-form" onSubmit={submit}>
      <div className="competition-config-scroll">
        <fieldset className="trainer-booking-section competition-config-section">
          <legend>1. Ikona i kolor zawodów</legend>
          <div className="competition-icon-preview" style={{ "--competition-color": color } as CSSProperties}><i><EventIcon id={icon} /></i><b>{name.trim() || "Nazwa zawodów"}</b></div>
          <div className="competition-icon-picker" role="group" aria-label="Ikona zawodów">{iconOptions.map((item) => <button key={item.id} type="button" aria-label={item.label} aria-pressed={icon === item.id} className={icon === item.id ? "active" : ""} onClick={() => setIcon(item.id)} style={{ "--competition-color": color } as CSSProperties}><item.icon /></button>)}</div>
          <div className="competition-color-picker" role="group" aria-label="Kolor zawodów">{colors.map((value, index) => <button key={value} type="button" aria-label={`Kolor ${["fioletowy", "niebieski", "pomarańczowy", "zielony", "czerwony", "turkusowy", "różowy", "szary"][index]}`} aria-pressed={color === value} onClick={() => setColor(value)} style={{ background: value }}>{color === value ? <Check /> : null}</button>)}</div>
        </fieldset>
        <fieldset className="trainer-booking-section competition-config-section"><legend>2. Nazwa zawodów</legend><label><span className="trainer-visually-hidden">Nazwa zawodów</span><input required maxLength={80} value={name} placeholder="np. Regionalne Zawody w Skokach" onChange={(event) => setName(event.target.value)} /></label></fieldset>
        <fieldset className="trainer-booking-section competition-config-section"><legend>3. Data</legend><label><span>Data rozpoczęcia</span><input required type="date" value={start} onChange={(event) => setStart(event.target.value)} /></label><label><span>Data zakończenia</span><input required type="date" min={start} value={end} onChange={(event) => setEnd(event.target.value)} /></label></fieldset>
        <fieldset className="trainer-booking-section competition-config-section"><legend>4. Miejsce</legend><label><span>Miejsce zawodów</span><input maxLength={120} value={place} placeholder="np. KJ Leśna Polana, Wrocław" onChange={(event) => setPlace(event.target.value)} /></label></fieldset>
        <fieldset className="trainer-booking-section competition-config-section"><legend>5. Liczba osób</legend><p className="competition-field-hint">Puste = bez limitu. Limit liczy potwierdzonych i oczekujących.</p><label><span>Maksymalna liczba zapisanych</span><input type="number" min={1} step={1} value={capacity} placeholder="np. 20 — puste = bez limitu" onChange={(event) => setCapacity(event.target.value)} /></label></fieldset>
        <fieldset className="trainer-booking-section competition-config-section"><legend>6. Powiadomienia</legend><div className="competition-notification-options">{([
          ["all", "Powiadom wszystkich", "Wszyscy członkowie stajni"],
          ["selected", "Powiadom wybranych", "Wybierz osoby do powiadomienia"],
          ["none", "Nie powiadamiaj", "Zawody pojawią się na liście bez powiadomienia"],
        ] as const).map(([value, label, description]) => <label className={notification === value ? "active" : ""} key={value}><input type="radio" name="competition-notification" value={value} checked={notification === value} onChange={() => { setNotification(value); setError(""); }} /><span><b>{label}</b><small>{description}</small></span></label>)}</div>
          {notification === "selected" ? <div className="competition-recipients">{people.map((person) => <label key={person}><input type="checkbox" checked={recipients.includes(person)} onChange={() => { setRecipients((current) => current.includes(person) ? current.filter((item) => item !== person) : [...current, person]); setError(""); }} /><span>{person}</span></label>)}</div> : null}
        </fieldset>
        {error ? <p className="trainer-booking-error" role="alert">{error}</p> : null}
      </div>
      <div className="competition-config-submit"><button className="owner-primary" type="submit">Zapisz zawody</button><small>Podgląd demonstracyjny · bez wysyłania powiadomień</small></div>
    </form>
  </>;
}

export default function TrainerCompetitionsApp() {
  const [screen, setScreen] = useState<"list" | "create" | "detail">("list");
  const [tab, setTab] = useState<"current" | "archive">("current");
  const [competitions, setCompetitions] = useState<Competition[]>([{ id: 1, name: "Warka", icon: "trophy", color: colors[2], start: "2026-10-16", end: "2026-10-16", place: "", capacity: "", notification: "all", recipients: [], archived: false, messages: [] }]);
  const [selected, setSelected] = useState<number | null>(null);
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [notice, setNotice] = useState("");
  const current = competitions.find((item) => item.id === selected);
  const shown = competitions.filter((item) => item.archived === (tab === "archive"));

  function save(draft: CompetitionDraft) {
    setCompetitions((items) => [...items, { ...draft, id: Math.max(0, ...items.map((item) => item.id)) + 1, archived: false, messages: [] }]);
    setTab("current"); setScreen("list"); setNotice("Zawody zapisane w podglądzie.");
  }

  function openEvent(id: number) {
    setSelected(id); setScreen("detail"); setDeleteConfirm(false); setMessageOpen(false); setMessage(""); setNotice("");
  }

  function addMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!current || !message.trim()) return;
    setCompetitions((items) => items.map((item) => item.id === current.id ? { ...item, messages: [...item.messages, { id: item.messages.length + 1, text: message.trim() }] } : item));
    setMessage(""); setMessageOpen(false);
  }

  function archiveCurrent() {
    if (!current) return;
    const archived = !current.archived;
    setCompetitions((items) => items.map((item) => item.id === current.id ? { ...item, archived } : item));
    setTab(archived ? "archive" : "current"); setScreen("list"); setNotice(archived ? "Zawody przeniesione do archiwum." : "Zawody przywrócone.");
  }

  return <div className="owner-module-app trainer-booking-app trainer-competitions-app">
    {screen === "create" ? <ConfigureCompetition onSave={save} onCancel={() => setScreen("list")} /> : <>
      <header className="groom-app-bar"><span><small>STABLE 360°</small><b>Trener</b></span><span className="competition-role-icon"><Trophy /></span></header>
      <div className="competition-main-scroll">
        {notice ? <p className="competition-notice" role="status"><Check />{notice}</p> : null}
        {screen === "detail" && current ? <>
          <button className="competition-back" type="button" onClick={() => setScreen("list")}><ArrowLeft />Powrót do zawodów</button>
          <article className="competition-detail-heading" style={{ "--competition-color": current.color } as CSSProperties}><i><EventIcon id={current.icon} /></i><div><small>{current.archived ? "Archiwum" : "Moje zawody"}</small><b>{current.name}</b><span><CalendarDays />{formatDate(current.start)}{current.end !== current.start ? ` – ${formatDate(current.end)}` : ""}</span>{current.place ? <span><MapPin />{current.place}</span> : null}{current.capacity ? <span>Limit: {current.capacity} osób</span> : null}</div></article>
          <div className="competition-statistics" aria-label="Uczestnicy zawodów">{statisticItems.map(({ icon: Icon, label }) => <div key={label}><span><Icon />0</span><small>{label}</small></div>)}</div>
          <section className="competition-detail-section"><h4><Users />Zapisani</h4><p>Nikt jeszcze się nie zapisał.</p></section>
          <section className="competition-detail-section"><h4><Megaphone />Najnowsze komunikaty</h4>{current.messages.length ? <div className="competition-messages">{current.messages.map((item) => <article key={item.id}><Megaphone /><p>{item.text}</p></article>)}</div> : <p>Brak komunikatów.</p>}
            {messageOpen ? <form className="competition-message-form" onSubmit={addMessage}><label><span>Treść komunikatu</span><textarea required maxLength={500} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Wpisz informację dla uczestników…" /></label><div><button type="button" onClick={() => setMessageOpen(false)}>Anuluj</button><button type="submit">Dodaj komunikat</button></div></form> : <button type="button" className="competition-outline-button" onClick={() => setMessageOpen(true)}><Plus />Dodaj komunikat</button>}
          </section>
          <button className="competition-outline-button" type="button" onClick={archiveCurrent}><Archive />{current.archived ? "Przywróć z archiwum" : "Przenieś do archiwum"}</button>
          {deleteConfirm ? <div className="competition-delete-confirm"><b>Usunąć te zawody z podglądu?</b><div><button type="button" onClick={() => setDeleteConfirm(false)}>Anuluj</button><button type="button" onClick={() => { setCompetitions((items) => items.filter((item) => item.id !== current.id)); setSelected(null); setScreen("list"); setDeleteConfirm(false); setNotice("Zawody usunięte z podglądu."); }}>Usuń zawody</button></div></div> : <button className="competition-delete" type="button" onClick={() => setDeleteConfirm(true)}><Trash2 />Usuń zawody</button>}
        </> : <>
          <h3 className="competition-page-title">Zawody</h3>
          <div className="competition-list-tabs" role="group" aria-label="Lista zawodów"><button id="competition-current-tab" type="button" aria-pressed={tab === "current"} aria-controls="competition-list-panel" className={tab === "current" ? "active" : ""} onClick={() => setTab("current")}>Moje zawody</button><button id="competition-archive-tab" type="button" aria-pressed={tab === "archive"} aria-controls="competition-list-panel" className={tab === "archive" ? "active" : ""} onClick={() => setTab("archive")}>Archiwum</button></div>
          <div id="competition-list-panel" aria-labelledby={tab === "current" ? "competition-current-tab" : "competition-archive-tab"}>
            <b className="competition-list-count">{tab === "current" ? "Moje zawody" : "Archiwum"} ({shown.length})</b>
            {shown.length ? <div className="competition-event-list">{shown.map((item) => <button type="button" className="competition-event-card" key={item.id} onClick={() => openEvent(item.id)} style={{ "--competition-color": item.color } as CSSProperties}><i><EventIcon id={item.icon} /></i><b>{item.name}</b><span><CalendarDays />{formatDate(item.start)}</span>{item.place ? <span><MapPin />{item.place}</span> : null}<small><Users />0 zapisanych</small><ChevronRight /></button>)}</div> : <div className="competition-empty"><Trophy /><b>{tab === "archive" ? "Archiwum jest puste" : "Nie masz jeszcze zawodów"}</b><span>{tab === "archive" ? "Tutaj znajdziesz zarchiwizowane wydarzenia." : "Dodaj zawody, aby zacząć planować."}</span></div>}
          </div>
          {tab === "current" ? <button type="button" className="competition-outline-button" onClick={() => { setScreen("create"); setNotice(""); }}><Plus />Dodaj zawody</button> : null}
        </>}
        <small className="competition-demo-note">Dane przykładowe · zmiany dotyczą tylko podglądu</small>
      </div>
      <footer className="competition-bottom-label"><Trophy /><b>Zawody</b></footer>
    </>}
  </div>;
}

