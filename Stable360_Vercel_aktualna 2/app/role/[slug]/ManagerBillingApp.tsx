"use client";

import { useState, type FormEvent } from "react";
import { Award, Box, Check, ChevronLeft, ChevronRight, Download, FileSpreadsheet, Gem, Heart, Home, Info, Leaf, Magnet, Pencil, Plus, Shield, Star, Trash2, WalletCards, X } from "lucide-react";
import { createBillingPrintHtml, createBillingWorkbook, type ExportRow } from "./managerBillingExports";

const packageIcons = [{ id: "box", icon: Box, label: "Boks" }, { id: "award", icon: Award, label: "Medal" }, { id: "star", icon: Star, label: "Gwiazda" }, { id: "gem", icon: Gem, label: "Diament" }, { id: "leaf", icon: Leaf, label: "Liść" }, { id: "heart", icon: Heart, label: "Serce" }, { id: "shield", icon: Shield, label: "Tarcza" }, { id: "horse", icon: Magnet, label: "Podkowa" }] as const;
type PackageIcon = (typeof packageIcons)[number]["id"];
type BoxPackage = { id: number; name: string; price: number; description: string; icon: PackageIcon };
type BillingLine = { id: number; name: string; price: number; discount: number; discountType: "fixed" | "percent"; description: string; packageId?: number };
type BillingPeriod = { items: BillingLine[]; paid: number };
const horseNames = ["Misia", "Misiu"];
const months = Array.from({ length: 8 }, (_, index) => { const date = new Date(2026, 5 + index, 1); return { id: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`, label: date.toLocaleDateString("pl-PL", { month: "long", year: "numeric" }) }; });

export function parseAmount(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;
  const [whole, fraction = ""] = normalized.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) && cents <= 100_000_000 ? cents : null;
}

export function lineAmount(line: BillingLine) {
  return Math.max(0, line.price - (line.discountType === "percent" ? Math.round(line.price * line.discount / 100) : line.discount));
}

function money(cents: number) {
  return (cents / 100).toLocaleString("pl-PL", { style: "currency", currency: "PLN" });
}

function PackageSymbol({ id }: { id: PackageIcon }) {
  const Icon = packageIcons.find((item) => item.id === id)?.icon ?? Box;
  return <Icon aria-hidden="true" />;
}

export default function ManagerBillingApp() {
  const [horseIndex, setHorseIndex] = useState(0);
  const [month, setMonth] = useState("2026-10");
  const [packages, setPackages] = useState<BoxPackage[]>([]);
  const [periods, setPeriods] = useState<Record<string, BillingPeriod>>({});
  const [panel, setPanel] = useState<"package" | "line" | "payment" | null>(null);
  const [editingPackage, setEditingPackage] = useState<number | null>(null);
  const [icon, setIcon] = useState<PackageIcon>("box");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountType, setDiscountType] = useState<"fixed" | "percent">("fixed");
  const [payment, setPayment] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const periodKey = `${horseNames[horseIndex]}:${month}`;
  const period = periods[periodKey] ?? { items: [], paid: 0 };
  const total = period.items.reduce((sum, line) => sum + lineAmount(line), 0);
  const paid = Math.min(period.paid, total);
  const remaining = total - paid;
  const monthLabel = months.find((item) => item.id === month)?.label ?? month;
  const status = !total ? "Brak rozliczenia" : paid === total ? "Rozliczone" : paid > 0 ? "Częściowo zapłacone" : "Do zapłaty";

  function updatePeriod(change: (value: BillingPeriod) => BillingPeriod) {
    setPeriods((all) => {
      const next = change(all[periodKey] ?? { items: [], paid: 0 });
      const amount = next.items.reduce((sum, line) => sum + lineAmount(line), 0);
      return { ...all, [periodKey]: { ...next, paid: Math.min(next.paid, amount) } };
    });
  }

  function changeContext(nextHorse: number, nextMonth: string) {
    setHorseIndex(nextHorse); setMonth(nextMonth); setPanel(null); setError(""); setNotice("");
  }

  function openPackage(item?: BoxPackage) {
    setEditingPackage(item?.id ?? null); setIcon(item?.icon ?? "box"); setName(item?.name ?? ""); setPrice(item ? (item.price / 100).toFixed(2) : ""); setDescription(item?.description ?? ""); setError(""); setPanel("package");
  }

  function savePackage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = parseAmount(price);
    if (!name.trim() || amount === null || amount <= 0) { setError("Podaj nazwę i cenę większą od zera, z maksymalnie dwoma miejscami po przecinku."); return; }
    const historicalIds = Object.values(periods).flatMap((value) => value.items.map((line) => line.packageId ?? 0));
    setPackages((items) => { const item: BoxPackage = { id: editingPackage ?? Math.max(0, ...items.map((entry) => entry.id), ...historicalIds) + 1, name: name.trim(), price: amount, description: description.trim(), icon }; return editingPackage ? items.map((entry) => entry.id === editingPackage ? item : entry) : [...items, item]; });
    setPanel(null); setNotice(editingPackage ? "Pakiet zmieniony. Zapisane pozycje zachowują poprzednią cenę." : "Pakiet dodany. Kliknij go lub przeciągnij do rozliczenia.");
  }

  function applyPackage(packageId: number) {
    const item = packages.find((entry) => entry.id === packageId);
    if (!item) return;
    if (period.items.some((line) => line.packageId === item.id)) { setNotice("Ten pakiet jest już w rozliczeniu tego miesiąca."); return; }
    updatePeriod((value) => value.items.some((line) => line.packageId === item.id) ? value : { ...value, items: [...value.items, { id: Math.max(0, ...value.items.map((line) => line.id)) + 1, name: `Pakiet boksów — ${item.name}`, price: item.price, discount: 0, discountType: "fixed", description: item.description, packageId: item.id }] });
    setNotice("Pakiet dodany do wybranego konia i miesiąca.");
  }

  function openLine() {
    setName(""); setPrice(""); setDiscount(""); setDiscountType("fixed"); setDescription(""); setError(""); setPanel("line");
  }

  function saveLine(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = parseAmount(price), discountCents = discount.trim() ? parseAmount(discount) : 0;
    if (!name.trim() || amount === null || amount <= 0 || discountCents === null) { setError("Podaj nazwę, dodatnią cenę i poprawny rabat."); return; }
    const discountValue = discountType === "percent" ? discountCents / 100 : discountCents;
    if ((discountType === "percent" && discountValue > 100) || (discountType === "fixed" && discountValue > amount)) { setError("Rabat nie może przekraczać ceny ani 100%."); return; }
    updatePeriod((value) => ({ ...value, items: [...value.items, { id: Math.max(0, ...value.items.map((line) => line.id)) + 1, name: name.trim(), price: amount, discount: discountValue, discountType, description: description.trim() }] }));
    setPanel(null); setNotice("Pozycja dodana do miesięcznego rozliczenia.");
  }

  function savePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = parseAmount(payment);
    if (amount === null || amount <= 0 || amount > remaining) { setError(`Podaj kwotę większą od zera, nie wyższą niż ${money(remaining)}.`); return; }
    updatePeriod((value) => ({ ...value, paid: value.paid + amount }));
    setPanel(null); setNotice("Wpłata odnotowana w podglądzie.");
  }

  function exportRows(): ExportRow[] {
    return period.items.map((line) => ({ name: line.name, price: line.price, discount: line.discount ? line.discountType === "percent" ? `${line.discount}%` : money(line.discount) : "—", amount: lineAmount(line), description: line.description }));
  }

  function downloadExcel() {
    const bytes = createBillingWorkbook(`${horseNames[horseIndex]} — ${monthLabel}`, exportRows(), total, paid);
    const url = URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `Stable360_${horseNames[horseIndex]}_${month}.xlsx`; document.body.appendChild(anchor); anchor.click(); anchor.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Plik Excel z rozliczeniem został przygotowany do pobrania.");
  }

  function printPdf() {
    const frame = document.createElement("iframe"); frame.title = "Rozliczenie do zapisu jako PDF"; frame.style.cssText = "position:fixed;left:0;top:0;width:0;height:0;border:0";
    frame.onload = () => { const target = frame.contentWindow; if (!target) { frame.remove(); return; } target.onafterprint = () => frame.remove(); target.focus(); target.print(); window.setTimeout(() => frame.remove(), 60000); };
    frame.srcdoc = createBillingPrintHtml(`${horseNames[horseIndex]} — ${monthLabel}`, exportRows(), total, paid); document.body.appendChild(frame);
    setNotice("W oknie drukowania wybierz „Zapisz jako PDF”.");
  }

  return <div className="manager-resource-app manager-billing-app"><header className="manager-app-header"><span><WalletCards /><b>Manager stajni</b></span><small>STABLE360</small></header><div className="manager-app-scroll">
    <div className="manager-billing-horse-switch"><button type="button" aria-label="Poprzedni koń" onClick={() => changeContext((horseIndex + horseNames.length - 1) % horseNames.length, month)}><ChevronLeft /></button><div><h3>{horseNames[horseIndex]}</h3><p>Rozliczenie za {monthLabel}</p></div><button type="button" aria-label="Następny koń" onClick={() => changeContext((horseIndex + 1) % horseNames.length, month)}><ChevronRight /></button></div>
    <div className="manager-billing-export"><button type="button" onClick={printPdf}><Download />Eksportuj PDF</button><button type="button" onClick={downloadExcel}><FileSpreadsheet />Eksportuj Excel</button></div>
    <div className="manager-billing-payment-tools"><span className={`manager-payment-badge ${paid === total && total > 0 ? "settled" : ""}`}>{status}</span><button type="button" disabled={!remaining} onClick={() => { setPayment(""); setError(""); setPanel("payment"); }}><WalletCards />Częściowo zapłacone</button><button type="button" disabled={!total} onClick={() => { updatePeriod((value) => ({ ...value, paid: paid === total ? 0 : total })); setNotice(paid === total ? "Rozliczenie ponownie oznaczone jako niezapłacone." : "Miesiąc oznaczony jako rozliczony w podglądzie."); }}><Check />{paid === total && total > 0 ? "Cofnij rozliczenie" : "Oznacz jako rozliczone"}</button></div>
    <div className="manager-billing-months" role="group" aria-label="Miesiąc rozliczenia">{months.map((item) => <button type="button" key={item.id} className={month === item.id ? "active" : ""} aria-pressed={month === item.id} onClick={() => changeContext(horseIndex, item.id)}>{item.label}</button>)}</div>
    {notice ? <p className="manager-resource-notice" role="status">{notice}</p> : null}
    <div className="manager-billing-workspace"><section className="manager-billing-ledger" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); applyPackage(Number(event.dataTransfer.getData("application/x-stable360-package"))); }}><header><h4><Home />Rozliczenie stajni — {horseNames[horseIndex]}</h4><button type="button" onClick={openLine}><Plus />Dodaj pozycję</button></header><div className="manager-billing-table-heading"><span>Kategoria / pozycja</span><b>{monthLabel}</b></div>{period.items.length ? period.items.map((line) => <article className={line.packageId ? "manager-billing-line package" : "manager-billing-line"} key={line.id}><div><b>{line.name}</b>{line.discount > 0 ? <small>{money(line.price)} · rabat {line.discountType === "percent" ? `${line.discount}%` : money(line.discount)}</small> : null}{line.description ? <p>{line.description}</p> : null}</div><strong>{money(lineAmount(line))}</strong><button type="button" aria-label={`Usuń pozycję ${line.name}`} onClick={() => updatePeriod((value) => ({ ...value, items: value.items.filter((item) => item.id !== line.id) }))}><Trash2 /></button></article>) : <p className="manager-ledger-empty">Brak pozycji w tym miesiącu. Dodaj pozycję lub przeciągnij pakiet.</p>}<div className="manager-billing-total"><b>Suma</b><strong>{money(total)}</strong></div>{paid > 0 ? <div className="manager-billing-balance"><span>Zapłacono <b>{money(paid)}</b></span><span>Pozostało <b>{money(remaining)}</b></span></div> : null}</section>
      <aside className="manager-box-packages"><header><h4>Pakiety boksów</h4><button type="button" onClick={() => openPackage()}><Plus />Dodaj pakiet</button></header><p>Kliknij pakiet lub przeciągnij go do tabeli, aby dodać go do tego miesiąca.</p>{packages.length ? packages.map((item) => { const applied = period.items.some((line) => line.packageId === item.id); return <article key={item.id} className={applied ? "applied" : ""} draggable onDragStart={(event) => { event.dataTransfer.setData("application/x-stable360-package", String(item.id)); event.dataTransfer.effectAllowed = "copy"; }}><button className="manager-package-apply" type="button" aria-label={`Dodaj pakiet ${item.name} do miesiąca`} onClick={() => applyPackage(item.id)}><PackageSymbol id={item.icon} /><b>{item.name}</b>{applied ? <small>W tym miesiącu</small> : <Plus />}</button><strong>{money(item.price)} <small>/ miesiąc</small></strong>{item.description ? <p>{item.description}</p> : null}<div><button type="button" aria-label={`Edytuj pakiet ${item.name}`} onClick={() => openPackage(item)}><Pencil />Edytuj</button><button type="button" aria-label={`Usuń pakiet ${item.name}`} onClick={() => { setPackages((items) => items.filter((entry) => entry.id !== item.id)); setNotice("Pakiet usunięty z katalogu. Zapisane pozycje pozostają w rozliczeniach."); }}><Trash2 />Usuń</button></div></article>; }) : <p className="manager-packages-empty">Brak pakietów. Dodaj pierwszy pakiet boksowy.</p>}<div className="manager-package-info"><Info /><span>Pakiet przypisujesz do wybranego konia i miesiąca. Kolejne miesiące rozliczasz osobno.</span></div></aside>
    </div><p className="manager-resource-demo">Dane przykładowe · oznaczenia płatności dotyczą wyłącznie podglądu</p>
    </div>{panel ? <div className="manager-panel-overlay manager-billing-overlay" onKeyDown={(event) => { if (event.key === "Escape") setPanel(null); }}><section className="manager-panel manager-billing-panel" role="dialog" aria-modal="false" aria-labelledby="manager-billing-panel-title"><header><h4 id="manager-billing-panel-title">{panel === "package" ? editingPackage ? "Edytuj pakiet" : "Dodaj pakiet" : panel === "line" ? "Dodaj pozycję" : "Odnotuj wpłatę"}</h4><button type="button" aria-label="Zamknij formularz rozliczenia" onClick={() => setPanel(null)}><X /></button></header><form className="manager-panel-form" onSubmit={panel === "package" ? savePackage : panel === "line" ? saveLine : savePayment}>
      {panel === "payment" ? <><p className="manager-payment-remaining">Pozostało do zapłaty: <b>{money(remaining)}</b></p><label><span>Kwota wpłaty (zł)</span><input autoFocus required inputMode="decimal" value={payment} onChange={(event) => setPayment(event.target.value)} placeholder="np. 500,00" /></label></> : <>
        {panel === "package" ? <div className="manager-package-icon-picker" role="group" aria-label="Ikona pakietu">{packageIcons.map(({ id, label, icon: Icon }) => <button type="button" key={id} aria-label={label} aria-pressed={icon === id} className={icon === id ? "active" : ""} onClick={() => setIcon(id)}><Icon /></button>)}</div> : null}
        <label><span>{panel === "package" ? "Nazwa pakietu" : "Nazwa pozycji"}</span><input autoFocus required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder={panel === "package" ? "np. Pakiet Premium" : "np. Siano"} /></label>
        <label><span>{panel === "package" ? "Cena (zł / miesiąc)" : "Cena (zł)"}</span><input required inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} placeholder={panel === "package" ? "np. 2500" : "np. 200"} /></label>
        {panel === "line" ? <div className="manager-time-fields"><label><span>Rodzaj rabatu</span><select value={discountType} onChange={(event) => setDiscountType(event.target.value as "fixed" | "percent")}><option value="fixed">Kwotowy (zł)</option><option value="percent">Procentowy (%)</option></select></label><label><span>Rabat (opcjonalnie)</span><input inputMode="decimal" value={discount} onChange={(event) => setDiscount(event.target.value)} placeholder="np. 20" /></label></div> : null}
        <label className="manager-description-field"><span>Opis (opcjonalnie)</span><textarea maxLength={panel === "line" ? 200 : 500} value={description} onChange={(event) => setDescription(event.target.value)} placeholder={panel === "package" ? "np. Boks, pasza podstawowa, ściółka i codzienne sprzątanie" : "np. Siano dla koni — dostawa co tydzień"} /></label>
      </>}{error ? <p className="manager-form-error" role="alert">{error}</p> : null}<div className="manager-billing-form-actions"><button type="button" onClick={() => setPanel(null)}>Anuluj</button><button className="manager-gold-button" type="submit">{panel === "package" ? "Zapisz pakiet" : panel === "line" ? "Dodaj pozycję" : "Zapisz wpłatę"}</button></div>
    </form></section></div> : null}
  </div>;
}
