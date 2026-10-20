"use client";

import { useState, type FormEvent } from "react";
import { Building2, Box, CalendarDays, Check, ChevronLeft, ChevronRight, CircleHelp, Cloud, CloudRain, Crown, FileSpreadsheet, Magnet, MapPin, MoreHorizontal, NotebookPen, Percent, Pin, Plus, RotateCw, Search, Sun, Users, WalletCards, X } from "lucide-react";

import ManagerBillingApp from "./ManagerBillingApp";
import ManagerStructureApp from "./ManagerStructureApp";

type Weather = "sun" | "cloud" | "rain";
type Resource = { id: number; name: string; type: "carousel" | "paddock" };
type Group = { id: number; resourceId: number; name: string; start: string; end: string };
type DayNote = { id: number; date: string; text: string; pinned: boolean };
type Assignments = Record<string, Record<number, string[]>>;

const horses: { id: string; name: string; sex: string; age: number; weather: Weather[] }[] = [
  { id: "misia", name: "Misia", sex: "Klacz", age: 8, weather: ["sun", "cloud"] },
  { id: "misiu", name: "Misiu", sex: "Wałach", age: 12, weather: ["sun", "cloud", "rain"] },
];
const weatherOptions = [{ id: "sun", label: "Słonecznie", icon: Sun }, { id: "cloud", label: "Pochmurno", icon: Cloud }, { id: "rain", label: "Deszczowo", icon: CloudRain }] as const;

function dateText(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
}

export function ManagerResourceApp() {
  const [date, setDate] = useState("2026-10-16");
  const [weather, setWeather] = useState<Weather | null>("sun");
  const [query, setQuery] = useState("");
  const [selectedHorse, setSelectedHorse] = useState<string | null>(null);
  const [resources, setResources] = useState<Resource[]>([{ id: 1, name: "Karuzela 1", type: "carousel" }]);
  const [groups, setGroups] = useState<Group[]>([{ id: 1, resourceId: 1, name: "Rano", start: "08:00", end: "09:00" }, { id: 2, resourceId: 1, name: "Popołudnie", start: "15:00", end: "16:00" }]);
  const [assignments, setAssignments] = useState<Assignments>({});
  const [notes, setNotes] = useState<DayNote[]>([]);
  const [panel, setPanel] = useState<"group" | "resource" | "notes" | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [resourceId, setResourceId] = useState(1);
  const [groupName, setGroupName] = useState("");
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("09:00");
  const [resourceName, setResourceName] = useState("");
  const [resourceType, setResourceType] = useState<Resource["type"]>("paddock");
  const [noteText, setNoteText] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const horse = horses.find((item) => item.id === selectedHorse);
  const search = query.trim().toLocaleLowerCase("pl");
  const shownHorses = horses.filter((item) => (!weather || item.weather.includes(weather)) && `${item.name} ${item.sex} ${item.age}`.toLocaleLowerCase("pl").includes(search));
  const dayNotes = notes.filter((note) => note.date === date);
  const pinnedNotes = notes.filter((note) => note.pinned && note.date !== date);

  function changeDate(value: string) {
    if (!value) return;
    setDate(value); setNotice(""); setSelectedHorse(null);
  }

  function moveDate(offset: number) {
    const next = new Date(`${date}T12:00:00Z`);
    next.setUTCDate(next.getUTCDate() + offset);
    changeDate(next.toISOString().slice(0, 10));
  }

  function hasConflict(horseId: string, target: Group, day: string, candidateGroups = groups) {
    return candidateGroups.some((group) => group.id !== target.id && group.start < target.end && group.end > target.start && assignments[day]?.[group.id]?.includes(horseId));
  }

  function assignHorse(horseId: string, groupId: number) {
    const target = groups.find((item) => item.id === groupId);
    if (!target || !horses.some((item) => item.id === horseId)) return;
    if (hasConflict(horseId, target, date)) { setNotice("Ten koń ma już przydział w tym czasie. Wybierz inną grupę."); return; }
    setAssignments((current) => {
      const day = current[date] ?? {};
      const members = day[groupId] ?? [];
      return members.includes(horseId) ? current : { ...current, [date]: { ...day, [groupId]: [...members, horseId] } };
    });
    setSelectedHorse(null); setNotice("Koń przypisany do grupy w podglądzie.");
  }

  function removeHorse(horseId: string, groupId: number) {
    setAssignments((current) => ({ ...current, [date]: { ...current[date], [groupId]: (current[date]?.[groupId] ?? []).filter((id) => id !== horseId) } }));
    setNotice("Koń usunięty z grupy w tym dniu.");
  }

  function openGroup(id: number, group?: Group) {
    setResourceId(id); setEditing(group?.id ?? null); setGroupName(group?.name ?? ""); setStart(group?.start ?? "08:00"); setEnd(group?.end ?? "09:00"); setError(""); setPanel("group");
  }

  function saveGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!groupName.trim()) { setError("Podaj nazwę grupy."); return; }
    if (end <= start) { setError("Godzina zakończenia musi być późniejsza od rozpoczęcia."); return; }
    const group: Group = { id: editing ?? Math.max(0, ...groups.map((item) => item.id)) + 1, resourceId, name: groupName.trim(), start, end };
    const candidate = editing ? groups.map((item) => item.id === editing ? group : item) : [...groups, group];
    if (editing && Object.entries(assignments).some(([day, values]) => (values[editing] ?? []).some((horseId) => hasConflict(horseId, group, day, candidate)))) { setError("Nowa godzina koliduje z inną grupą przypisanego konia."); return; }
    setGroups(candidate); setPanel(null); setNotice(editing ? "Grupa zaktualizowana w podglądzie." : "Nowa grupa dodana do grafiku.");
  }

  function openResource(type: Resource["type"]) {
    setResourceType(type); setResourceName(""); setError(""); setPanel("resource");
  }

  function saveResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!resourceName.trim()) { setError("Podaj nazwę obiektu."); return; }
    setResources((items) => [...items, { id: Math.max(0, ...items.map((item) => item.id)) + 1, name: resourceName.trim(), type: resourceType }]);
    setPanel(null); setNotice("Obiekt dodany. Możesz utworzyć dla niego grupę.");
  }

  function saveNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!noteText.trim()) return;
    setNotes((items) => [...items, { id: Math.max(0, ...items.map((item) => item.id)) + 1, date, text: noteText.trim(), pinned: false }]);
    setNoteText("");
  }

  function renderNote(note: DayNote) {
    return <article className="manager-note-card" key={note.id}><p>{note.text}</p><div><small>{dateText(note.date)}</small><button type="button" aria-label={note.pinned ? "Odepnij notatkę" : "Przypnij notatkę"} aria-pressed={note.pinned} onClick={() => setNotes((items) => items.map((item) => item.id === note.id ? { ...item, pinned: !item.pinned } : item))}><Pin /></button></div></article>;
  }

  return <div className="manager-resource-app">
    <header className="manager-app-header"><span><Crown /><b>Manager stajni</b></span><small>STABLE360</small></header>
    <div className="manager-app-scroll">
      <div className="manager-resource-toolbar"><div><h3>Grafik zasobów</h3><p>Zarządzaj karuzelą i padokami</p></div><div className="manager-date-tools"><button type="button" aria-label="Poprzedni dzień" onClick={() => moveDate(-1)}><ChevronLeft /></button><label><span className="trainer-visually-hidden">Dzień grafiku</span><input type="date" value={date} onChange={(event) => changeDate(event.target.value)} /></label><button type="button" aria-label="Następny dzień" onClick={() => moveDate(1)}><ChevronRight /></button><button type="button" onClick={() => changeDate(new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Warsaw" }))}>Dzisiaj</button><button type="button" className="manager-notes-button" onClick={() => { setNoteText(""); setPanel("notes"); }}><NotebookPen />Notatki{dayNotes.length ? <i>{dayNotes.length}</i> : null}</button></div></div>
      <div className="manager-weather-tools" role="group" aria-label="Filtr koni według pogody"><span>Warunki:</span>{weatherOptions.map(({ id, label, icon: Icon }) => <button type="button" key={id} title={label} aria-label={label} aria-pressed={weather === id} className={weather === id ? "active" : ""} onClick={() => { setWeather((current) => current === id ? null : id); setSelectedHorse(null); }}><Icon /></button>)}<small>{weather ? weatherOptions.find((item) => item.id === weather)?.label : "Wszystkie konie"}</small></div>
      {notice ? <p className="manager-resource-notice" role="status">{notice}</p> : null}
      <div className="manager-resource-workspace">
        <aside className="manager-horse-pool"><h4>Konie <span>{shownHorses.length}</span></h4><p>Przeciągnij konia do grupy albo kliknij konia, a potem cel.</p><label className="manager-horse-search"><Search /><span className="trainer-visually-hidden">Szukaj konia po imieniu, płci lub wieku</span><input value={query} onChange={(event) => { setQuery(event.target.value); setSelectedHorse(null); }} placeholder="Imię, płeć lub wiek" /></label><div>{shownHorses.length ? shownHorses.map((item) => <button key={item.id} type="button" draggable aria-pressed={selectedHorse === item.id} className={selectedHorse === item.id ? "selected" : ""} onClick={() => setSelectedHorse((current) => current === item.id ? null : item.id)} onDragStart={(event) => { event.dataTransfer.setData("text/plain", item.id); event.dataTransfer.effectAllowed = "copy"; setSelectedHorse(item.id); }}><i><Magnet /></i><span><b>{item.name}</b><small>{item.sex} · {item.age} lat</small></span>{selectedHorse === item.id ? <Check /> : <Plus />}</button>) : <p className="manager-empty-search">Brak koni dla tych filtrów.</p>}</div>{horse ? <small className="manager-selected-hint">Wybrano: {horse.name}. Kliknij „Dodaj wybranego” w grupie.</small> : null}</aside>
        <div className="manager-resource-groups">{(["carousel", "paddock"] as const).map((type) => {
          const items = resources.filter((item) => item.type === type);
          return <section className="manager-resource-section" key={type}><header><div><h4>{type === "carousel" ? <RotateCw /> : <MapPin />}{type === "carousel" ? "Karuzela" : "Padoki"}</h4><p>Utwórz grupę, a następnie dodaj do niej konie.</p></div><button type="button" onClick={() => openResource(type)}><Plus />{type === "carousel" ? "Dodaj karuzelę" : "Dodaj padok"}</button></header>
            {items.length ? items.map((resource) => <div className="manager-resource-object" key={resource.id}><div className="manager-resource-object-heading"><b>{resource.name}</b><button type="button" onClick={() => openGroup(resource.id)}><Plus />Dodaj grupę</button></div><div className="manager-group-list">{groups.filter((group) => group.resourceId === resource.id).map((group) => <article className="manager-resource-group" key={group.id} onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; }} onDrop={(event) => { event.preventDefault(); assignHorse(event.dataTransfer.getData("text/plain"), group.id); }}><header><span><b>{group.name}</b><small>{group.start}–{group.end}</small></span><button type="button" aria-label={`Edytuj grupę ${group.name}`} onClick={() => openGroup(resource.id, group)}><MoreHorizontal /></button></header><div className="manager-group-horses">{(assignments[date]?.[group.id] ?? []).map((horseId) => { const member = horses.find((item) => item.id === horseId)!; return <span key={horseId}><Magnet /><b>{member.name}</b><button type="button" aria-label={`Usuń ${member.name} z grupy ${group.name}`} onClick={() => removeHorse(horseId, group.id)}><X /></button></span>; })}<button type="button" className="manager-assignment-target" disabled={!selectedHorse} aria-label={horse ? `Dodaj ${horse.name} do grupy ${group.name}` : `Najpierw wybierz konia do grupy ${group.name}`} onClick={() => selectedHorse && assignHorse(selectedHorse, group.id)}><Plus />{horse ? "Dodaj wybranego" : "Przeciągnij konia do grupy"}</button></div></article>)}</div>{!groups.some((group) => group.resourceId === resource.id) ? <p className="manager-resource-empty">Brak grup. Dodaj pierwszą sesję dla tego obiektu.</p> : null}</div>) : <p className="manager-resource-empty">Dodaj obiekt typu „Padok”, aby planować grupy.</p>}
          </section>;
        })}</div>
      </div>
      <p className="manager-resource-demo">Dane przykładowe · osobny przydział koni dla każdego dnia · zmiany tylko w podglądzie</p>
    </div>
    {panel ? <div className="manager-panel-overlay" onKeyDown={(event) => { if (event.key === "Escape") setPanel(null); }}><section className="manager-panel" role="dialog" aria-modal="false" aria-labelledby="manager-panel-title"><header><h4 id="manager-panel-title">{panel === "notes" ? "Notatki" : panel === "resource" ? "Dodaj obiekt" : editing ? "Edytuj grupę" : "Dodaj grupę"}</h4><button type="button" aria-label="Zamknij panel" onClick={() => setPanel(null)}><X /></button></header>
      {panel === "notes" ? <div className="manager-notes-content"><div className="manager-notes-date"><button type="button" aria-label="Poprzedni dzień notatek" onClick={() => moveDate(-1)}><ChevronLeft /></button><b>{dateText(date)}</b><button type="button" aria-label="Następny dzień notatek" onClick={() => moveDate(1)}><ChevronRight /></button></div><h5>Notatki na ten dzień</h5>{dayNotes.length ? dayNotes.map(renderNote) : <p>Brak notatek na ten dzień.</p>}<h5>Przypięte z innych dni</h5>{pinnedNotes.length ? pinnedNotes.map(renderNote) : <p>Brak innych przypiętych notatek.</p>}<form onSubmit={saveNote}><label><span>Nowa notatka</span><textarea autoFocus required maxLength={500} value={noteText} onChange={(event) => setNoteText(event.target.value)} placeholder="Informacja dla zespołu stajni…" /></label><button type="submit" className="manager-gold-button"><Plus />Dodaj notatkę</button></form></div> : <form className="manager-panel-form" onSubmit={panel === "resource" ? saveResource : saveGroup}>
        {panel === "resource" ? <><label><span>Typ obiektu</span><select value={resourceType} onChange={(event) => setResourceType(event.target.value as Resource["type"])}><option value="carousel">Karuzela</option><option value="paddock">Padok</option></select></label><label><span>Nazwa obiektu</span><input autoFocus required maxLength={50} value={resourceName} onChange={(event) => setResourceName(event.target.value)} placeholder="np. Padok 1" /></label></> : <><label><span>Obiekt</span><select value={resourceId} onChange={(event) => setResourceId(Number(event.target.value))}>{resources.map((resource) => <option key={resource.id} value={resource.id}>{resource.name}</option>)}</select></label><label><span>Nazwa grupy</span><input autoFocus required maxLength={50} value={groupName} onChange={(event) => setGroupName(event.target.value)} placeholder="np. Grupa poranna" /></label><div className="manager-time-fields"><label><span>Od godziny</span><input required type="time" value={start} onChange={(event) => setStart(event.target.value)} /></label><label><span>Do godziny</span><input required type="time" min={start} value={end} onChange={(event) => setEnd(event.target.value)} /></label></div><small>Grupy są dostępne w grafiku każdego dnia. Konie przypisujesz osobno dla wybranego dnia.</small></>}
        {error ? <p className="manager-form-error" role="alert">{error}</p> : null}<button type="submit" className="manager-gold-button">{panel === "resource" ? "Dodaj obiekt" : "Zapisz grupę"}</button>
      </form>}
    </section></div> : null}
  </div>;
}

export default function ManagerShowcase() {
  const [active, setActive] = useState<"resources" | "billing" | "structure">("resources");
  const resourcesActive = active === "resources";
  const Icon = resourcesActive ? CalendarDays : active === "billing" ? WalletCards : Building2;
  const features = resourcesActive ? [
    { icon: RotateCw, label: "Oddzielne sekcje karuzeli i padoków" },
    { icon: Users, label: "Wiele koni w każdej grupie" },
    { icon: Sun, label: "Filtry pogody i wyszukiwanie koni" },
    { icon: NotebookPen, label: "Notatki i przypinanie informacji" },
  ] : active === "billing" ? [
    { icon: Box, label: "Pakiety boksów w rozliczeniu miesiąca" },
    { icon: Percent, label: "Dodatkowe pozycje i rabaty" },
    { icon: Check, label: "Status rozliczenia i częściowe wpłaty" },
    { icon: FileSpreadsheet, label: "Eksport do PDF i Excel" },
  ] : [
    { icon: Building2, label: "Części stajni z własną ikoną i kolorem" },
    { icon: Magnet, label: "Przypisywanie koni do części" },
    { icon: Users, label: "Właściciele i pracownicy w jednym widoku" },
    { icon: Crown, label: "Role każdej osoby osobno w każdej części" },
  ];
  return <div className="manager-resource-showcase">
    <aside className="manager-feature-copy">
      <small>W TWOJEJ ROLI</small>
      <div className="manager-module-picker" role="group" aria-label="Moduły managera">
        <button type="button" className={resourcesActive ? "active" : ""} aria-pressed={resourcesActive} onClick={() => setActive("resources")}><CalendarDays /><span><b>Grafik zasobów</b><small>Karuzela, padoki i grupy koni.</small></span></button>
        <button type="button" className={active === "billing" ? "active" : ""} aria-pressed={active === "billing"} onClick={() => setActive("billing")}><WalletCards /><span><b>Rozliczenia</b><small>Pakiety, koszty i status płatności.</small></span></button>
        <button type="button" className={active === "structure" ? "active" : ""} aria-pressed={active === "structure"} onClick={() => setActive("structure")}><Building2 /><span><b>Struktura stajni</b><small>Części, konie, osoby i role.</small></span></button>
      </div>
      <h3>{resourcesActive ? "Grafik zasobów" : active === "billing" ? "Rozliczenia koni" : "Struktura stajni"}</h3>
      <p>{resourcesActive ? "Karuzela i padoki w jednym widoku. Twórz grupy i sprawnie rozdzielaj konie między sesje." : active === "billing" ? "Pakiety boksów i dodatkowe koszty w jednym miesięcznym rozliczeniu. Dla każdego konia osobno." : "Podziel stajnię na części i przypisz do nich konie oraz ludzi. Role dopasuj do pracy każdej osoby w danej części."}</p>
      <ul>{features.map(({ icon: FeatureIcon, label }) => <li key={label}><FeatureIcon />{label}</li>)}</ul>
      <div className="manager-demo-help"><CircleHelp /><span>{resourcesActive ? "Wybierz konia, a następnie grupę. Na komputerze możesz też przeciągać konie." : active === "billing" ? "Dodaj pakiet boksów, a następnie kliknij go lub przeciągnij do tabeli rozliczenia." : "Utwórz część, wybierz ikonę i kolor, a następnie dodaj konie i osoby."}</span></div>
    </aside>
    <div className="manager-preview-wrap"><div className="manager-preview-label"><Icon /><span><small>INTERAKTYWNY PODGLĄD MANAGERA</small><b>{resourcesActive ? "Karuzela i padoki" : active === "billing" ? "Rozliczenie stajni" : "Struktura stajni"}</b></span></div><div className="manager-tablet"><div className="manager-module-panel" hidden={!resourcesActive}><ManagerResourceApp /></div><div className="manager-module-panel" hidden={active !== "billing"}><ManagerBillingApp /></div><div className="manager-module-panel" hidden={active !== "structure"}><ManagerStructureApp /></div></div></div>
  </div>;
}
