"use client";

import { useState } from "react";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Download,
  FileSpreadsheet,
  HeartPulse,
  Home,
  Pencil,
  Plus,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Utensils,
  WalletCards,
} from "lucide-react";

type Demo = "horse" | "billing" | "schedule";

const demos = [
  { id: "horse" as const, title: "Karta konia", copy: "Wszystkie informacje o koniu w jednym miejscu.", icon: HeartPulse },
  { id: "billing" as const, title: "Rozliczenia", copy: "Koszty, przychody i treningi w czytelnym podsumowaniu.", icon: WalletCards },
  { id: "schedule" as const, title: "Grafik", copy: "Plan tygodnia, aktywności i dostępność koni.", icon: CalendarDays },
];

function HorseCard() {
  const [tab, setTab] = useState("Ogólne");
  const [editing, setEditing] = useState(false);
  const tabs = ["Ogólne", "Zdrowie", "Dieta", "Ruch"];

  return <div className="phone-screen horse-phone">
    <div className="phone-appbar"><ArrowLeft /><strong>Karta konia</strong><ShieldCheck /></div>
    <div className="horse-summary">
      <img src="/roles-hero-horse.jpg" alt="Misiu" />
      <div><b>Misiu</b><span>12 lat · wałach</span></div>
      <button onClick={() => setEditing((value) => !value)}><Pencil />{editing ? "Gotowe" : "Edytuj"}</button>
    </div>
    <div className="mini-tabs" role="tablist">{tabs.map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}</div>
    {tab === "Ogólne" && <div className="horse-info-card"><h4>Informacje ogólne</h4><dl>
      <div><dt>Data urodzenia</dt><dd>{editing ? <input defaultValue="13.09.2014" /> : "13.09.2014"}</dd></div>
      <div><dt>Rasa</dt><dd>{editing ? <input defaultValue="HOL" /> : "HOL"}</dd></div>
      <div><dt>Płeć</dt><dd>Wałach</dd></div>
      <div><dt>Numer UELN</dt><dd>—</dd></div>
    </dl></div>}
    {tab === "Zdrowie" && <div className="phone-empty"><Stethoscope/><b>Zdrowie pod kontrolą</b><span>Szczepienia aktualne · ostatnia kontrola 12.08</span></div>}
    {tab === "Dieta" && <div className="phone-empty"><Utensils/><b>Plan żywienia</b><span>3 posiłki · suplementacja aktywna</span></div>}
    {tab === "Ruch" && <div className="phone-empty"><Activity/><b>Ruch w tym tygodniu</b><span>4 treningi · 1 dzień odpoczynku</span></div>}
    <div className="phone-bottom"><span className="active"><Home/>Home</span><span><CalendarDays/>Grafik</span></div>
  </div>;
}

function BillingCard() {
  const [month, setMonth] = useState("sierpień 2026");
  const [added, setAdded] = useState(false);
  const [notice, setNotice] = useState("");

  const exportFile = (name: string) => {
    setNotice(`${name} gotowy`);
    window.setTimeout(() => setNotice(""), 1600);
  };

  return <div className="phone-screen billing-phone">
    <div className="phone-appbar"><ArrowLeft /><strong>Rozliczenia</strong><ReceiptText /></div>
    <div className="billing-title"><b>Misiu</b><span>Rozliczenie miesięczne</span></div>
    <div className="export-row"><button onClick={() => exportFile("PDF")}><Download/>PDF</button><button onClick={() => exportFile("Excel")}><FileSpreadsheet/>Excel</button></div>
    <div className="month-switch">{["lipiec 2026", "sierpień 2026", "wrzesień 2026"].map((item) => <button key={item} onClick={() => setMonth(item)} className={month === item ? "active" : ""}>{item.replace(" 2026", "")}</button>)}</div>
    <div className="money-grid"><article><span>Właściciel</span><b>{added ? "240,00 zł" : "0,00 zł"}</b></article><article><span>Mój koszt</span><b>{added ? "60,00 zł" : "0,00 zł"}</b></article><article className="income"><span>Przychód</span><b>{added ? "180,00 zł" : "0,00 zł"}</b></article></div>
    <div className="settlement-card"><div><b>Rozliczenie stajni</b><button onClick={() => setAdded((value) => !value)}><Plus/>{added ? "Usuń" : "Dodaj pozycję"}</button></div>{added ? <p><span>Trening indywidualny</span><strong>240,00 zł</strong></p> : <em>Brak pozycji w tym miesiącu.</em>}</div>
    <div className="settlement-card"><div><b>Treningi</b><small>Zaciągnięte z grafiku</small></div><em>{added ? "1 trening · trener główny" : "Brak treningów w tym miesiącu."}</em></div>
    {notice && <div className="phone-toast"><CircleCheck/>{notice}</div>}
    <div className="phone-bottom"><span><Home/>Pulpit</span><span className="active"><WalletCards/>Rozliczenia</span><span><CalendarDays/>Grafik</span></div>
  </div>;
}

function ScheduleCard() {
  const [view, setView] = useState("Tydzień");
  const [activity, setActivity] = useState("Jazda");
  const [booked, setBooked] = useState(false);

  return <div className="phone-screen schedule-phone">
    <div className="phone-appbar"><ArrowLeft /><strong>Grafik</strong><CalendarDays /></div>
    <div className="week-row"><button><ChevronLeft/></button><strong>17–23 sierpnia 2026</strong><button><ChevronRight/></button></div>
    <div className="view-row"><div><button className={view === "Dzień" ? "active" : ""} onClick={() => setView("Dzień")}>Dzień</button><button className={view === "Tydzień" ? "active" : ""} onClick={() => setView("Tydzień")}>Tydzień</button></div><button>Dzisiaj</button></div>
    <div className="activity-row">{["Jazda", "Lonża", "Karuzela", "Bieżnia"].map((item) => <button key={item} onClick={() => setActivity(item)} className={activity === item ? "active" : ""}>{item}</button>)}</div>
    <p className="schedule-hint">Wybierz aktywność, a potem kliknij wolne pole.</p>
    <div className="schedule-grid"><div className="schedule-head"><b>Koń</b><b>{view === "Tydzień" ? "Pon 17.08" : "08:00"}</b><b>{view === "Tydzień" ? "Wt 18.08" : "10:00"}</b></div><div className="schedule-line"><strong>Misiu</strong><button onClick={() => setBooked((value) => !value)} className={booked ? "booked" : ""}>{booked ? activity : "Wolne"}</button><button>Wolne</button></div></div>
    <button className="book-activity" onClick={() => setBooked(true)}><Plus/>Umów aktywność</button>
    <div className="phone-bottom"><span><Home/>Pulpit</span><span className="active"><CalendarDays/>Grafik</span><span><Sparkles/>Więcej</span></div>
  </div>;
}

export default function ProductPhoneShowcase() {
  const [active, setActive] = useState<Demo>("horse");

  return <section className="product-demo" id="produkt" aria-labelledby="product-demo-title">
    <div className="product-demo-heading"><p>Produkt w praktyce</p><h2 id="product-demo-title">Trzy widoki.<br/><span>Jedno proste miejsce.</span></h2><div>Przeklikaj najważniejsze ekrany Stable360 i zobacz, jak porządkują codzienność stajni.</div></div>
    <div className="product-demo-shell">
      <div className="demo-picker" role="tablist" aria-label="Ekrany aplikacji">{demos.map(({ id, title, copy, icon: Icon }, index) => <button key={id} role="tab" aria-selected={active === id} className={active === id ? "active" : ""} onClick={() => setActive(id)}><i>{String(index + 1).padStart(2, "0")}</i><span><Icon/><b>{title}</b><small>{copy}</small></span><ChevronRight/></button>)}</div>
      <div className="phone-stage">
        <div className="phone-glow" aria-hidden="true" />
        <div className="phone-device">
          <div className="phone-speaker" aria-hidden="true" />
          <div className="phone-content" key={active}>{active === "horse" ? <HorseCard/> : active === "billing" ? <BillingCard/> : <ScheduleCard/>}</div>
        </div>
        <div className="phone-caption"><span>Interaktywny podgląd</span><b>{demos.find((demo) => demo.id === active)?.title}</b></div>
      </div>
    </div>
  </section>;
}
