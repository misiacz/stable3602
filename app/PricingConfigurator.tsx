"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Crown,
  GraduationCap,
  HeartPulse,
  Minus,
  Plus,
  RefreshCw,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { calculateMultiRoleSubscription, calculateSubscription, formatMoney } from "./pricingRules.mjs";

type RoleKey = "owner" | "headRider" | "trainer";

type RoleDefinition = {
  key: RoleKey;
  optionLabel: string;
  label: string;
  sectionTitle: string;
  sectionDescription: string;
  rule: string;
  Icon: typeof Crown;
};

const roleOrder: RoleKey[] = ["owner", "headRider", "trainer"];

const roles: RoleDefinition[] = [
  {
    key: "owner",
    optionLabel: "Jestem właścicielem konia",
    label: "Właściciel",
    sectionTitle: "Twoje konie",
    sectionDescription: "Podaj liczbę koni, których jesteś właścicielem.",
    rule: "Własny koń zawsze jest liczony w kategorii właściciela — również wtedy, gdy go trenujesz lub jesteś jego jeźdźcem głównym.",
    Icon: Crown,
  },
  {
    key: "headRider",
    optionLabel: "Jestem jeźdźcem głównym",
    label: "Jeździec główny",
    sectionTitle: "Konie, dla których jesteś jeźdźcem głównym",
    sectionDescription: "Podaj liczbę koni, których nie posiadasz, ale jesteś ich jeźdźcem głównym.",
    rule: "Jeśli jednocześnie trenujesz tego samego konia, system policzy go tylko jako konia jeźdźca głównego.",
    Icon: HeartPulse,
  },
  {
    key: "trainer",
    optionLabel: "Jestem trenerem",
    label: "Trener",
    sectionTitle: "Konie rekreacyjne, które trenujesz",
    sectionDescription: "Podaj liczbę koni rekreacyjnych, dla których potrzebujesz dostępu jako trener.",
    rule: "W tej kategorii są tylko konie rekreacyjne, których nie posiadasz i dla których nie jesteś jeźdźcem głównym.",
    Icon: GraduationCap,
  },
];

function horseWord(count: number) {
  if (count === 1) return "koń";
  if (count > 1 && count < 5) return "konie";
  return "koni";
}

function roleWord(count: number) {
  if (count === 1) return "rola";
  return "role";
}

export default function PricingConfigurator() {
  const [step, setStep] = useState(1);
  const [selectedRoles, setSelectedRoles] = useState<RoleKey[]>([]);
  const [horseCounts, setHorseCounts] = useState<Record<RoleKey, number>>({ owner: 0, headRider: 0, trainer: 0 });
  const [notice, setNotice] = useState("");

  const pricing = useMemo(() => calculateMultiRoleSubscription(horseCounts), [horseCounts]);
  const selectedDefinitions = roles.filter((role) => selectedRoles.includes(role.key));

  const toggleRole = (role: RoleKey) => {
    const removing = selectedRoles.includes(role);
    const nextRoles = (removing
      ? selectedRoles.filter((item) => item !== role)
      : [...selectedRoles, role]
    ).sort((a, b) => roleOrder.indexOf(a) - roleOrder.indexOf(b));
    setSelectedRoles(nextRoles);
    setHorseCounts((current) => ({ ...current, [role]: removing ? 0 : Math.max(1, current[role]) }));
    setNotice("");
  };

  const setSafeHorseCount = (role: RoleKey, value: number) => {
    const nextCount = Math.max(0, Math.min(200, Math.trunc(value || 0)));
    setHorseCounts((current) => ({ ...current, [role]: nextCount }));
  };

  const goForward = () => {
    if (!selectedRoles.length) {
      setNotice("Zaznacz co najmniej jedną rolę.");
      return;
    }
    if (step < 3) setStep((current) => current + 1);
    else setStep(2);
    setNotice("");
  };

  return <>
    <section className="pricing-configurator pricing-role-multi">
      <div className="pricing-workspace">
        <div className="pricing-calculator-label"><WalletCards /><span><small>Kalkulator cennika</small><b>Sprawdź koszt bez kupowania</b></span></div>
        <div className="pricing-main pricing-flow">
          <nav className="pricing-steps" aria-label="Etapy kalkulatora">
            {["Twoje role", "Liczba koni", "Wycena"].map((label, index) => <button key={label} className={step === index + 1 ? "active" : step > index + 1 ? "done" : ""} disabled={index + 1 > step || (!selectedRoles.length && index > 0)} onClick={() => setStep(index + 1)}><i>{step > index + 1 ? <Check /> : index + 1}</i><span>{label}</span></button>)}
          </nav>

          <div className="pricing-step-panel" key={step}>
            {step === 1 && <section className="pricing-role-step">
              <header><small>Krok 1 z 3</small><h2>W jaki sposób korzystasz ze Stable360?</h2><p>Zaznacz jedną, dwie albo wszystkie trzy role. Role mogą się łączyć i nie wykluczają się wzajemnie.</p></header>
              <div className="pricing-role-cards pricing-role-cards-multi">
                {roles.map(({ key, optionLabel, label, sectionDescription, Icon }) => {
                  const selected = selectedRoles.includes(key);
                  return <button type="button" data-role={key} key={key} className={selected ? "active" : ""} aria-pressed={selected} onClick={() => toggleRole(key)}><span className="role-card-top"><i><Icon /></i><b className={selected ? "selected" : ""}>{selected ? <Check /> : <Plus />}</b></span><strong>{optionLabel}</strong><p>{label}</p><small>{sectionDescription}</small></button>;
                })}
              </div>
              <div className="pricing-multi-hint"><ShieldCheck /><span><b>Wiele ról, jedna orientacyjna wycena</b><small>Kalkulator łączy naliczenia, ale każdy koń jest uwzględniany tylko jeden raz.</small></span></div>
              <div className="pricing-step-actions"><span /><button className="pricing-next" disabled={!selectedRoles.length} onClick={goForward}>Policz koszt<ArrowRight /></button></div>
            </section>}

            {step === 2 && selectedRoles.length > 0 && <section className="pricing-count-step pricing-multi-count-step">
              <header><small>Krok 2 z 3</small><h2>Podaj liczbę koni</h2><p>Każda rola ma osobne progi. Dla dużych stajni kalkulator automatycznie ogranicza maksymalną cenę.</p></header>
              <div className="pricing-role-config-list">
                {selectedDefinitions.map((definition) => <RoleConfigurationCard key={definition.key} definition={definition} count={horseCounts[definition.key]} pricing={pricing.categories[definition.key]} onCountChange={(value) => setSafeHorseCount(definition.key, value)} />)}
              </div>
              <div className="pricing-priority-rule"><RefreshCw /><span><b>Priorytet: właściciel → jeździec główny → trener</b><small>Nie wybierasz najtańszego wariantu ręcznie. Relacja z konkretnym koniem decyduje, w której kategorii zostanie policzony.</small></span></div>
              <div className="pricing-step-actions"><button className="pricing-back" onClick={() => setStep(1)}><ArrowLeft />Wstecz</button><button className="pricing-next" onClick={goForward}>Pokaż wycenę<ArrowRight /></button></div>
            </section>}

            {step === 3 && selectedRoles.length > 0 && <section className="pricing-review-step pricing-multi-review-step">
              <header><small>Krok 3 z 3</small><h2>Orientacyjny koszt miesięczny</h2><p>To wyłącznie kalkulacja cennika — na tej stronie niczego nie kupujesz i nie uruchamiasz płatności.</p></header>
              <div className="pricing-category-breakdowns">
                {selectedDefinitions.map((definition) => <CategoryBreakdown key={definition.key} definition={definition} pricing={pricing.categories[definition.key]} />)}
              </div>
              <div className="pricing-combined-total">
                <span><i><WalletCards /></i><span><small>Szacowany koszt miesięczny</small><b>Łącznie</b></span></span>
                <strong>{formatMoney(pricing.monthlyTotal)}<small>/ miesiąc</small></strong>
                <dl><div><dt>Wszystkie unikalne konie</dt><dd>{pricing.totalCount}</dd></div><div><dt>Łączny rabat</dt><dd>−{formatMoney(pricing.discountAmount)}</dd></div></dl>
              </div>
              {selectedRoles.some((role) => pricing.categories[role].capApplied) && <div className="pricing-large-stable-note"><ShieldCheck /><span><b>Zastosowano limit ceny dla dużej stajni</b><small>Po przekroczeniu standardowych progów kwota w danej kategorii nie rośnie już powyżej ustalonego maksimum.</small></span></div>}
              <div className="pricing-single-charge-note"><CheckCircle2 /><span><b>Jeden koń — jedno naliczenie</b><small>Koń może pojawiać się w kilku rolach, ale kalkulator uwzględnia go tylko raz według najwyższej relacji.</small></span></div>
              <div className="pricing-step-actions"><button className="pricing-back" onClick={() => setStep(2)}><ArrowLeft />Zmień liczbę koni</button><button className="pricing-next" onClick={() => setStep(1)}>Policz inny wariant<RefreshCw /></button></div>
            </section>}
          </div>
        </div>
      </div>

      <aside className="pricing-summary pricing-multi-summary">
        <small>Wynik kalkulacji</small>
        <h2>{selectedRoles.length ? selectedDefinitions.map((role) => role.label).join(" + ") : "Wybierz role"}</h2>
        <p>{selectedRoles.length ? `${pricing.totalCount} ${horseWord(pricing.totalCount)} · ${selectedRoles.length} ${roleWord(selectedRoles.length)}` : "Zaznacz wszystkie role, w których korzystasz ze Stable360."}</p>
        <div className="selected-price"><small>Szacowany koszt miesięczny</small><div><strong>{selectedRoles.length ? formatMoney(pricing.monthlyTotal) : "—"}</strong></div></div>
        {selectedRoles.length > 0 && <><div className="pricing-summary-roles">{selectedDefinitions.map((definition) => <div key={definition.key}><span><definition.Icon />{definition.label}<small>{pricing.categories[definition.key].count} {horseWord(pricing.categories[definition.key].count)}</small></span><b>{formatMoney(pricing.categories[definition.key].monthlyTotal)}</b></div>)}</div><div className="summary-savings"><span>Łączny rabat</span><b>−{formatMoney(pricing.discountAmount)}</b></div><hr/><ul><li><CheckCircle2/>To tylko kalkulacja — bez zakupu</li><li><RefreshCw/>Osobne progi dla każdej roli</li><li><ShieldCheck/>Limit ceny dla dużych stajni</li></ul></>}
        <button className="pricing-primary-cta" disabled={!selectedRoles.length} onClick={goForward}>{step === 1 ? <>Policz koszt<ArrowRight /></> : step === 2 ? <>Pokaż wycenę<ArrowRight /></> : <>Zmień dane<ArrowLeft /></>}</button>
        <p className="price-security"><ShieldCheck /> Bez uruchamiania płatności</p>
      </aside>
    </section>

    <div className="pricing-mobile-summary"><span><small>{selectedRoles.length ? `${pricing.totalCount} ${horseWord(pricing.totalCount)} · ${selectedRoles.length} ${roleWord(selectedRoles.length)}` : "Wybierz role"}</small><b>{selectedRoles.length ? `${formatMoney(pricing.monthlyTotal)} / mies.` : "—"}</b></span><button disabled={!selectedRoles.length} onClick={goForward}>{step === 3 ? "Zmień dane" : step === 2 ? "Pokaż wycenę" : "Policz"}<ArrowRight /></button></div>
    {notice && <div className="pricing-notice" role="status"><CheckCircle2 />{notice}<button aria-label="Zamknij komunikat" onClick={() => setNotice("")}>×</button></div>}
  </>;
}

function RoleConfigurationCard({ definition, count, pricing, onCountChange }: { definition: RoleDefinition; count: number; pricing: ReturnType<typeof calculateSubscription>; onCountChange: (value: number) => void }) {
  return <article className="pricing-role-config-card" data-role={definition.key}>
    <header><i><definition.Icon /></i><span><small>{definition.label}</small><h3>{definition.sectionTitle}</h3><p>{definition.sectionDescription}</p></span><strong>{formatMoney(pricing.monthlyTotal)}<small>/ mies.</small></strong></header>
    <div className="pricing-inline-counter"><button aria-label={`Odejmij konia — ${definition.label}`} disabled={count <= 0} onClick={() => onCountChange(count - 1)}><Minus /></button><label><span>Liczba koni</span><input aria-label={`Liczba koni — ${definition.label}`} type="number" min="0" max="200" value={count} onChange={(event) => onCountChange(Number(event.target.value))} /></label><button aria-label={`Dodaj konia — ${definition.label}`} onClick={() => onCountChange(count + 1)}><Plus /></button></div>
    <div className="pricing-role-config-footer"><span><ShieldCheck />{definition.rule}</span><b>{pricing.capApplied ? `Limit dużej stajni: ${formatMoney(pricing.maxMonthlyTotal)}` : pricing.count ? `${formatMoney(pricing.averagePerHorse)} średnio / koń` : "Brak naliczenia"}</b></div>
  </article>;
}

function CategoryBreakdown({ definition, pricing }: { definition: RoleDefinition; pricing: ReturnType<typeof calculateSubscription> }) {
  return <article className="pricing-category-card" data-role={definition.key}>
    <header><span><i><definition.Icon /></i><span><small>{definition.label}</small><b>{definition.sectionTitle}</b><em>{pricing.count} {horseWord(pricing.count)}</em></span></span><strong>{formatMoney(pricing.monthlyTotal)}</strong></header>
    {pricing.breakdown.length > 0 ? <div className="pricing-category-tiers">{pricing.breakdown.map((tier: { from: number; quantity: number; unitPrice: number; total: number }) => { const last = tier.from + tier.quantity - 1; return <div key={`${tier.from}-${last}`}><span>{tier.from === last ? `${tier.from}. koń` : `${tier.from}.–${last}. koń`}</span><b>{tier.quantity} × {formatMoney(tier.unitPrice)}</b><strong>{formatMoney(tier.total)}</strong></div>; })}{pricing.capApplied && <div className="pricing-cap-row"><span>Limit dużej stajni</span><b>−{formatMoney(pricing.largeStableDiscount)}</b><strong>{formatMoney(pricing.monthlyTotal)}</strong></div>}</div> : <p className="pricing-empty-category">Brak koni liczonych w tej kategorii.</p>}
    <footer><span>Łączny rabat w tej kategorii</span><b>−{formatMoney(pricing.discountAmount)}</b></footer>
  </article>;
}
