"use client";

import { useState } from "react";
import { CalendarDays, Check, ClipboardList, Hammer, HeartPulse, Home, Info, Menu, Plus, Settings, Trash2, X } from "lucide-react";
import { HorsesReadyApp, OwnerScheduleApp } from "./OwnerHorseShowcase";

const riderModules = [
  { id: "schedule", title: "Grafik koni", copy: "Zobacz wszystkie przypisane jazdy, treningi i konie.", icon: CalendarDays },
  { id: "horses", title: "Lista koni", copy: "Sprawdź, które konie są gotowe, a które jeszcze czekają.", icon: HeartPulse },
  { id: "tasks", title: "Zadania", copy: "Odbieraj, wykonuj i porządkuj zadania przypisane przez managera.", icon: ClipboardList },
] as const;

type RiderTask = { id: number; title: string; assignedBy: string; done: boolean };

function RiderTasksApp() {
  const [tab, setTab] = useState<"todo" | "done">("todo");
  const [tasks, setTasks] = useState<RiderTask[]>([
    { id: 1, title: "Przygotuj Lunę do jazdy", assignedBy: "Michalina", done: false },
    { id: 2, title: "Odprowadź Misiu na padok", assignedBy: "Kuba", done: false },
  ]);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const shown = tasks.filter((task) => task.done === (tab === "done"));
  const todoCount = tasks.filter((task) => !task.done).length;
  const doneCount = tasks.length - todoCount;
  const addTask = () => {
    if (!title.trim()) return;
    setTasks((current) => [...current, { id: Date.now(), title: title.trim(), assignedBy: "Ja", done: false }]);
    setTitle(""); setAdding(false); setTab("todo");
  };

  return <div className="owner-module-app groom-screen rider-tasks-app">
    <header className="groom-app-bar"><span><small>STABLE 360°</small><b>Jeździec</b></span><div><Info/><Settings/></div></header>
    <main className="rider-tasks-scroll">
      <header><b>Zadania</b><small>Zadania przypisane przez managera</small></header>
      <nav>
        <button className={tab === "todo" ? "active" : ""} onClick={() => setTab("todo")}>Do zrobienia <i>{todoCount}</i></button>
        <button className={tab === "done" ? "active" : ""} onClick={() => setTab("done")}>Ukończone <i>{doneCount}</i></button>
      </nav>
      {shown.length ? <div className="rider-task-list">{shown.map((task) => <article key={task.id}>
        <span className="rider-task-icon"><Hammer/></span>
        <span><b className={task.done ? "done" : ""}>{task.title}</b><small>Przypisał: {task.assignedBy}</small></span>
        <button className={task.done ? "checked" : ""} aria-label={task.done ? "Przywróć zadanie" : "Ukończ zadanie"} onClick={() => setTasks((current) => current.map((item) => item.id === task.id ? { ...item, done: !item.done } : item))}>{task.done && <Check/>}</button>
        <button className="delete" aria-label="Usuń zadanie" onClick={() => setTasks((current) => current.filter((item) => item.id !== task.id))}><Trash2/></button>
      </article>)}</div> : <div className="rider-task-empty"><ClipboardList/><b>{tab === "todo" ? "Brak zadań do zrobienia." : "Brak ukończonych zadań."}</b></div>}
      <button className="rider-task-add" aria-label="Dodaj zadanie" onClick={() => setAdding(true)}><Plus/></button>
      {adding && <div className="rider-task-sheet"><div><header><b>Nowe zadanie</b><button onClick={() => setAdding(false)}><X/></button></header><label><span>Nazwa zadania</span><input autoFocus placeholder="Co trzeba zrobić?" value={title} onChange={(event) => setTitle(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addTask()}/></label><button className="owner-primary" onClick={addTask}>Dodaj zadanie</button></div></div>}
    </main>
    <footer className="owner-app-bottom groom-app-bottom"><button><Home/>Pulpit</button><button><HeartPulse/>Konie</button><button><CalendarDays/>Grafik</button><button className="active"><Menu/>Więcej</button></footer>
  </div>;
}

export default function RiderShowcase() {
  const [active, setActive] = useState<(typeof riderModules)[number]["id"]>("schedule");
  const selected = riderModules.find((item) => item.id === active)!;
  const Icon = selected.icon;
  return <div className="owner-horse-showcase owner-modules-showcase groom-modules-showcase rider-work-showcase">
    <aside className="owner-module-tabs">{riderModules.map((item) => { const ItemIcon = item.icon; return <button className={active === item.id ? "active" : ""} onClick={() => setActive(item.id)} key={item.id}><ItemIcon/><span><b>{item.title}</b><small>{item.copy}</small></span></button>; })}</aside>
    <div className="owner-phone-wrap"><div className="owner-phone-label"><Icon/><span><small>INTERAKTYWNY MOCKUP JEŹDŹCA</small><b>{selected.title}</b></span></div><div className="mockup-phone"><div className="mockup-phone-notch"/>{active === "schedule" ? <OwnerScheduleApp role="Jeździec"/> : active === "horses" ? <HorsesReadyApp role="Jeździec"/> : <RiderTasksApp/>}</div></div>
  </div>;
}
