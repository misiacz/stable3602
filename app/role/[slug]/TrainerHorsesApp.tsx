"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, Check, ChevronRight, Info, Magnet, Plus, UserRound } from "lucide-react";

type TrainerHorse = { id: number; name: string; nickname: string; owner: string };

export default function TrainerHorsesApp({ onHorseAdded }: { onHorseAdded: (name: string) => void }) {
  const [horses, setHorses] = useState<TrainerHorse[]>([]);
  const [screen, setScreen] = useState<"list" | "add" | "detail">("list");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [owner, setOwner] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const current = horses.find((horse) => horse.id === selected);

  function startAdding() {
    setName(""); setNickname(""); setError(""); setNotice(""); setScreen("add");
  }

  function saveHorse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) { setError("Wpisz imię konia."); return; }
    const horseName = name.trim();
    setHorses((items) => [...items, { id: Math.max(0, ...items.map((item) => item.id)) + 1, name: horseName, nickname: nickname.trim(), owner: "" }]);
    onHorseAdded(horseName);
    setNotice("Koń dodany do listy w podglądzie."); setScreen("list");
  }

  function assignOwner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!current || !owner) return;
    setHorses((items) => items.map((horse) => horse.id === current.id ? { ...horse, owner } : horse));
    setNotice("Właściciel przypisany w podglądzie.");
  }

  return <div className="owner-module-app trainer-booking-app trainer-horses-app">
    {screen === "add" ? <>
      <header className="trainer-booking-header"><button type="button" aria-label="Wróć do moich koni" onClick={() => setScreen("list")}><ArrowLeft /></button><b>Dodaj konia</b><span /></header>
      <form className="trainer-horse-add-form" onSubmit={saveHorse}>
        <div className="trainer-horse-add-scroll">
          <div className="trainer-horse-identity"><i><Magnet /></i><label><span>Imię</span><input required autoComplete="off" maxLength={60} value={name} placeholder="Imię konia" onChange={(event) => { setName(event.target.value); setError(""); }} /></label><label><span>Pseudonim <small>(opcjonalnie)</small></span><input autoComplete="off" maxLength={60} value={nickname} placeholder="Pseudonim" onChange={(event) => setNickname(event.target.value)} /></label></div>
          <div className="trainer-horse-owner-info"><Info /><p>Po zapisaniu konia przypisz mu właściciela, aby mógł zobaczyć go w swoim panelu i samodzielnie uzupełnić resztę karty: zdrowie, dokumenty, dietę i wyposażenie.</p></div>
          {error ? <p className="trainer-booking-error" role="alert">{error}</p> : null}
        </div>
        <div className="competition-config-submit"><button type="submit" className="owner-primary">Dodaj konia</button><small>Podgląd demonstracyjny · bez zapisu w aplikacji</small></div>
      </form>
    </> : <>
      <header className="groom-app-bar"><span><small>STABLE 360°</small><b>Trener</b></span><span className="competition-role-icon"><Magnet /></span></header>
      <div className="trainer-horses-scroll">
        {notice ? <p className="trainer-horse-notice" role="status"><Check />{notice}</p> : null}
        {screen === "detail" && current ? <>
          <button type="button" className="competition-back" onClick={() => { setScreen("list"); setNotice(""); }}><ArrowLeft />Moje konie</button>
          <div className="trainer-horse-detail-heading"><i><Magnet /></i><div><b>{current.name}</b>{current.nickname ? <span>{current.nickname}</span> : null}<small>Brak zaplanowanych treningów</small></div></div>
          <form className="trainer-horse-owner-form" onSubmit={assignOwner}><h4><UserRound />Właściciel konia</h4><label><span>Przypisz właściciela</span><select required value={owner} onChange={(event) => setOwner(event.target.value)}><option value="">Wybierz właściciela</option><option>Anna Nowak</option><option>Julia Kowalska</option></select></label><button type="submit" className="owner-primary" disabled={!owner}>{current.owner ? "Zmień właściciela" : "Przypisz właściciela"}</button>{current.owner ? <p className="trainer-horse-assigned"><Check />Właściciel: {current.owner}</p> : null}</form>
          <div className="trainer-horse-owner-info"><Info /><p>Właściciel uzupełnia pozostałe informacje o koniu w swojej karcie. W tym podglądzie przypisanie jest przykładowe i nie przyznaje rzeczywistego dostępu.</p></div>
        </> : <>
          <h3 className="trainer-horses-title">Moje konie</h3><p className="trainer-horses-intro">Konie z Twoich treningów i dodane przez Ciebie</p>
          {horses.length ? <div className="trainer-horses-list">{horses.map((horse) => <button type="button" key={horse.id} onClick={() => { setSelected(horse.id); setOwner(horse.owner); setScreen("detail"); setNotice(""); }}><i><Magnet /></i><span><b>{horse.name}</b>{horse.nickname ? <small className="trainer-horse-nickname">{horse.nickname}</small> : null}<small>Brak zaplanowanych treningów</small></span><ChevronRight /></button>)}</div> : <div className="trainer-horses-empty"><Magnet /><p>Brak koni — dodaj pierwszego konia lub zaplanuj trening.</p></div>}
          <button type="button" className="owner-primary trainer-horse-add-button" onClick={startAdding}><Plus />Dodaj konia</button>
        </>}
        <small className="competition-demo-note">Dane przykładowe · zmiany dotyczą tylko podglądu</small>
      </div>
      <footer className="competition-bottom-label"><Magnet /><b>Moje konie</b></footer>
    </>}
  </div>;
}
