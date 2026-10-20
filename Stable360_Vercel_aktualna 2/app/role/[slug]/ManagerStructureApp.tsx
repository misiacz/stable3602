"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import { Building2, Check, ChevronLeft, ChevronRight, Crown, Home, Magnet, MoreHorizontal, Pencil, Plus, Search, Star, Trophy, UserRound, Users, X } from "lucide-react";

const partIcons = [{ id: "horse", label: "Podkowa", icon: Magnet }, { id: "home", label: "Stajnia", icon: Home }, { id: "star", label: "Gwiazda", icon: Star }, { id: "trophy", label: "Puchar", icon: Trophy }, { id: "people", label: "Zespół", icon: Users }, { id: "crown", label: "Korona", icon: Crown }] as const;
type PartIcon = (typeof partIcons)[number]["id"];
const colors = [{ value: "#7c20dd", name: "fioletowy" }, { value: "#3555d5", name: "niebieski" }, { value: "#c46c28", name: "pomarańczowy" }, { value: "#4f873b", name: "zielony" }, { value: "#b82942", name: "czerwony" }, { value: "#169c86", name: "turkusowy" }, { value: "#c92380", name: "różowy" }, { value: "#77717b", name: "szary" }];
const roleOptions = ["Członek", "Jeździec", "Luzak", "Jeździec główny", "Trener"] as const;
type PartRole = (typeof roleOptions)[number];
type Membership = { roles: PartRole[]; fullAccess: boolean };
type StablePart = { id: number; name: string; icon: PartIcon; color: string; horses: string[]; members: Record<string, Membership> };
type Panel = "part" | "horses" | "owners" | "staff" | "roles" | null;
const stableHorses = [{ id: "misia", name: "Misia" }, { id: "misiu", name: "Misiu" }];
const people = [{ id: "michalina", name: "Michalina", owner: true, employee: true, manager: true }, { id: "julia", name: "Julia", owner: true, employee: false, manager: false }];

function PartSymbol({ icon }: { icon: PartIcon }) {
  const Icon = partIcons.find((item) => item.id === icon)?.icon ?? Home;
  return <Icon aria-hidden="true" />;
}

function staffMembers(part: StablePart) {
  return people.filter((person) => part.members[person.id] && (person.employee || part.members[person.id].roles.some((role) => role !== "Członek")));
}

export default function ManagerStructureApp() {
  const [parts, setParts] = useState<StablePart[]>([]);
  const [panel, setPanel] = useState<Panel>(null);
  const [selectedPart, setSelectedPart] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<PartIcon>("horse");
  const [color, setColor] = useState(colors[3].value);
  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [previousPanel, setPreviousPanel] = useState<"owners" | "staff">("owners");
  const [roles, setRoles] = useState<PartRole[]>(["Członek"]);
  const [fullAccess, setFullAccess] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const current = parts.find((part) => part.id === selectedPart);
  const person = people.find((item) => item.id === selectedPerson);
  const unassigned = stableHorses.filter((horse) => !parts.some((part) => part.horses.includes(horse.id))).length;
  const employees = people.filter((item) => item.employee || parts.some((part) => part.members[item.id]?.roles.some((role) => role !== "Członek")));
  const search = query.trim().toLocaleLowerCase("pl");

  function openPart(part?: StablePart) {
    setEditing(!!part); setSelectedPart(part?.id ?? null); setName(part?.name ?? ""); setIcon(part?.icon ?? "horse"); setColor(part?.color ?? colors[3].value); setError(""); setPanel("part");
  }

  function savePart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) { setError("Podaj nazwę części stajni."); return; }
    if (parts.some((part) => part.id !== selectedPart && part.name.toLocaleLowerCase("pl") === name.trim().toLocaleLowerCase("pl"))) { setError("Część o tej nazwie już istnieje."); return; }
    setParts((items) => editing ? items.map((part) => part.id === selectedPart ? { ...part, name: name.trim(), icon, color } : part) : [...items, { id: Math.max(0, ...items.map((part) => part.id)) + 1, name: name.trim(), icon, color, horses: [], members: {} }]);
    setPanel(null); setNotice(editing ? "Część zaktualizowana w podglądzie." : "Nowa część dodana. Przypisz do niej konie i osoby.");
  }

  function openCategory(partId: number, category: "horses" | "owners" | "staff") {
    setSelectedPart(partId); setQuery(""); setError(""); setPanel(category);
  }

  function toggleHorse(horseId: string) {
    if (!current) return;
    const remove = current.horses.includes(horseId);
    setParts((items) => items.map((part) => part.id === current.id ? { ...part, horses: remove ? part.horses.filter((id) => id !== horseId) : [...part.horses.filter((id) => id !== horseId), horseId] } : remove ? part : { ...part, horses: part.horses.filter((id) => id !== horseId) }));
    setNotice(remove ? "Koń pozostaje bez przypisania do części." : "Koń przypisany do wybranej części stajni.");
  }

  function openRoles(personId: string, category: "owners" | "staff") {
    if (!current) return;
    const member = current.members[personId];
    const selected = people.find((item) => item.id === personId)!;
    setSelectedPerson(personId); setPreviousPanel(category); setRoles(member?.roles ?? ["Członek"]); setFullAccess(selected.manager || !!member?.fullAccess); setPanel("roles");
  }

  function removeMember(personId: string) {
    if (!current) return;
    setParts((items) => items.map((part) => {
      if (part.id !== current.id) return part;
      const members = { ...part.members }; delete members[personId];
      return { ...part, members };
    }));
    setNotice("Osoba usunięta z tej części. Pozostaje członkiem stajni.");
  }

  function saveRoles(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!current || !person) return;
    const nextRoles = Array.from(new Set<PartRole>(["Członek", ...roles]));
    setParts((items) => items.map((part) => part.id === current.id ? { ...part, members: { ...part.members, [person.id]: { roles: nextRoles, fullAccess: person.manager || fullAccess } } } : part));
    setPanel(previousPanel); setNotice("Role zapisane tylko dla wybranej części w podglądzie.");
  }

  const panelTitle = panel === "part" ? editing ? "Edytuj część" : "Nowa część" : panel === "roles" ? `${person?.name} — ${current?.name}` : `${panel === "horses" ? "Konie" : panel === "owners" ? "Właściciele" : "Pracownicy"} — ${current?.name}`;

  return <div className="manager-resource-app manager-structure-app">
    <header className="manager-app-header"><span><Building2 /><b>Manager stajni</b></span><small>STABLE360</small></header>
    <div className="manager-app-scroll">
      <div className="manager-structure-heading"><div><h3>Struktura stajni</h3><p>Podziel stajnię na części i przypisz do nich konie, właścicieli i pracowników.</p></div><button type="button" onClick={() => openPart()}><Plus />Dodaj część</button></div>
      <div className="manager-stable-summary"><b>Małe ufoludki</b><span>Konie: {stableHorses.length} · Właściciele: {people.filter((item) => item.owner).length} · Pracownicy: {employees.length}</span>{parts.length ? <small>Konie bez części: {unassigned} — widoczne w widoku całej stajni.</small> : null}</div>
      {notice ? <p className="manager-resource-notice" role="status">{notice}</p> : null}
      {parts.length ? <div className="manager-stable-parts">{parts.map((part) => {
        const owners = people.filter((item) => item.owner && !!part.members[item.id]);
        const staff = staffMembers(part);
        return <article className="manager-stable-part" key={part.id} style={{ "--part-color": part.color } as CSSProperties}>
          <header><i><PartSymbol icon={part.icon} /></i><div><b>{part.name}</b><small>Konie: {part.horses.length} · Właściciele: {owners.length} · Pracownicy: {staff.length}</small></div><button type="button" aria-label={`Edytuj część ${part.name}`} onClick={() => openPart(part)}><MoreHorizontal /></button></header>
          <div className="manager-part-categories">
            <button type="button" onClick={() => openCategory(part.id, "horses")}><span className="manager-part-category-heading"><Magnet /><b>Konie ({part.horses.length})</b><ChevronRight /></span>{part.horses.length ? <span className="manager-part-member-chips">{part.horses.map((id) => <span key={id}><i>{stableHorses.find((horse) => horse.id === id)?.name.charAt(0)}</i>{stableHorses.find((horse) => horse.id === id)?.name}</span>)}</span> : <small>Kliknij, aby dodać konie</small>}</button>
            <button type="button" onClick={() => openCategory(part.id, "owners")}><span className="manager-part-category-heading"><Users /><b>Właściciele ({owners.length})</b><ChevronRight /></span>{owners.length ? <span className="manager-part-member-chips">{owners.map((owner) => <span key={owner.id}><i>{owner.name.charAt(0)}</i>{owner.name}</span>)}</span> : <small>Kliknij, aby dodać właścicieli</small>}</button>
            <button type="button" onClick={() => openCategory(part.id, "staff")}><span className="manager-part-category-heading"><UserRound /><b>Pracownicy ({staff.length})</b><ChevronRight /></span>{staff.length ? <span className="manager-part-member-chips">{staff.map((employee) => <span key={employee.id}><i>{employee.name.charAt(0)}</i>{employee.name}</span>)}</span> : <small>Kliknij, aby dodać pracowników</small>}</button>
          </div>
        </article>;
      })}</div> : <div className="manager-structure-empty"><Building2 /><p>Stajnia nie ma jeszcze części. Dodaj część, aby podzielić konie i ludzi np. na rekreację, pensjonat i sport.</p><button type="button" className="manager-gold-button" onClick={() => openPart()}><Plus />Dodaj pierwszą część</button></div>}
      <p className="manager-resource-demo">Dane przykładowe · zmiany ról i przypisań dotyczą tylko podglądu</p>
    </div>
    {panel ? <div className="manager-panel-overlay manager-billing-overlay" onKeyDown={(event) => { if (event.key === "Escape") setPanel(null); }}><section className="manager-panel manager-billing-panel manager-structure-panel" role="dialog" aria-modal="false" aria-labelledby="manager-structure-panel-title"><header><h4 id="manager-structure-panel-title">{panelTitle}</h4><button type="button" aria-label="Zamknij panel struktury" onClick={() => setPanel(null)}><X /></button></header>
      {panel === "part" ? <form className="manager-panel-form" onSubmit={savePart}><label><span>Nazwa części</span><input autoFocus required maxLength={60} value={name} onChange={(event) => { setName(event.target.value); setError(""); }} placeholder="np. Część pensjonatowa" /></label><div className="manager-structure-icon-picker" role="group" aria-label="Ikona części"><span>Ikona</span><div>{partIcons.map(({ id, label, icon: Icon }) => <button type="button" key={id} aria-label={label} aria-pressed={icon === id} className={icon === id ? "active" : ""} onClick={() => setIcon(id)}><Icon /></button>)}</div></div><div className="manager-structure-color-picker" role="group" aria-label="Kolor części"><span>Kolor</span><div>{colors.map((item) => <button type="button" key={item.value} aria-label={`Kolor ${item.name}`} aria-pressed={color === item.value} style={{ background: item.value }} onClick={() => setColor(item.value)}>{color === item.value ? <Check /> : null}</button>)}</div></div>{error ? <p className="manager-form-error" role="alert">{error}</p> : null}<button type="submit" className="manager-gold-button">{editing ? "Zapisz zmiany" : "Dodaj część"}</button></form> : panel === "roles" && current && person ? <form className="manager-panel-form manager-roles-form" onSubmit={saveRoles}><button type="button" className="manager-role-back" onClick={() => setPanel(previousPanel)}><ChevronLeft />Wróć do listy</button><p>Role w tej części</p><div className="manager-structure-role-options">{roleOptions.map((role) => <label key={role}><input type="checkbox" checked={role === "Członek" || roles.includes(role)} disabled={role === "Członek"} onChange={() => setRoles((items) => items.includes(role) ? items.filter((item) => item !== role) : [...items, role])} /><span>{role}</span></label>)}</div><small>„Członek” to rola podstawowa. Pozostałe role wybierasz osobno w każdej części.</small><label className="manager-full-access"><span><b>Dostęp do całej stajni</b><small>{person.manager ? "Manager zawsze widzi całą stajnię." : "Dodatkowy dostęp poza wybraną częścią."}</small></span><input type="checkbox" role="switch" aria-label="Dostęp do całej stajni" checked={person.manager || fullAccess} disabled={person.manager} onChange={(event) => setFullAccess(event.target.checked)} /></label><button type="submit" className="manager-gold-button">{current.members[person.id] ? "Zapisz role" : "Dodaj do części"}</button></form> : current ? <div className="manager-structure-assign-panel"><label className="manager-structure-search"><Search /><span className="trainer-visually-hidden">{panel === "horses" ? "Szukaj konia" : "Szukaj osoby"}</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={panel === "horses" ? "Szukaj konia…" : "Szukaj osoby…"} /></label>
        {panel === "horses" ? <div className="manager-structure-choice-list">{stableHorses.filter((horse) => horse.name.toLocaleLowerCase("pl").includes(search)).map((horse) => { const assigned = parts.find((part) => part.horses.includes(horse.id)); return <label key={horse.id}><input type="checkbox" checked={current.horses.includes(horse.id)} onChange={() => toggleHorse(horse.id)} /><span><b>{horse.name}</b><small>{assigned?.id === current.id ? "W tej części" : assigned ? `Część: ${assigned.name} — wybór przeniesie konia` : "Bez części"}</small></span></label>; })}{!stableHorses.some((horse) => horse.name.toLocaleLowerCase("pl").includes(search)) ? <p>Nie znaleziono konia.</p> : null}</div> : <div className="manager-structure-people-list">{people.filter((item) => (panel === "owners" ? item.owner : employees.some((employee) => employee.id === item.id)) && item.name.toLocaleLowerCase("pl").includes(search)).map((item) => { const membership = current.members[item.id]; return <div key={item.id}><label><input type="checkbox" checked={!!membership} onChange={() => membership ? removeMember(item.id) : openRoles(item.id, panel === "owners" ? "owners" : "staff")} /><span><b>{item.name}</b><small>{membership ? membership.roles.join(", ") : "Nie należy do tej części"}</small></span></label>{membership ? <button type="button" aria-label={`Edytuj role ${item.name}`} onClick={() => openRoles(item.id, panel === "owners" ? "owners" : "staff")}><Pencil /></button> : null}</div>; })}</div>}
        <small className="manager-structure-assignment-hint">{panel === "horses" ? "Koń należy do jednej części. Wybranie go w innej części przeniesie przypisanie." : "Jedna osoba może należeć do kilku części i mieć w nich różne role."}</small>
      </div> : null}
    </section></div> : null}
  </div>;
}
