import type { Metadata } from "next";
import { ArrowRight, BarChart3, CalendarCheck2, CalendarDays, Calculator, ChevronsRight, CircleAlert, Clock3, Crown, FileSpreadsheet, FileText, HeartPulse, Headphones, Mail, MessageCircle, Monitor, MonitorSmartphone, NotebookPen, PersonStanding, Phone, PieChart, Shield, ShieldCheck, SlidersHorizontal, Smartphone, TrendingUp, TriangleAlert, Trophy, UserPlus, UserRound, Users, WalletCards, Wrench } from "lucide-react";
import NavMenu from "./NavMenu";
import RoleQuiz from "./RoleQuiz";
import { roleProfiles } from "./role-data";

export const metadata: Metadata = { title: "Stable360 — zarządzanie stajnią", description: "Kompleksowe narzędzie do zarządzania stajnią, końmi, treningami, zespołem i finansami." };

const benefits = [
  { icon: Clock3, title: "45 dni za darmo", detail: "Bez zobowiązań" },
  { icon: ShieldCheck, title: "Bezpieczne dane", detail: "Twoje dane są chronione" },
  { icon: MonitorSmartphone, title: "Dostęp wszędzie", detail: "Web i aplikacja mobilna" },
  { icon: Headphones, title: "Wsparcie, które rozumie", detail: "Jesteśmy tu dla Ciebie" },
];

const roles = [
  {
    slug: "manager", icon: Crown, title: "Manager stajni",
    description: roleProfiles.manager.summary,
    features: [[Users, roleProfiles["manager"].features[0]], [CalendarDays, roleProfiles["manager"].features[1]], [WalletCards, roleProfiles["manager"].features[2]], [FileSpreadsheet, roleProfiles["manager"].features[3]]],
    cta: "Zobacz rolę managera",
  },
  {
    slug: "owner", icon: UserRound, title: "Właściciel",
    description: roleProfiles.owner.summary,
    features: [[HeartPulse, roleProfiles["owner"].features[0]], [CalendarDays, roleProfiles["owner"].features[1]], [NotebookPen, roleProfiles["owner"].features[2]], [Calculator, roleProfiles["owner"].features[3]]],
    cta: "Zobacz rolę właściciela",
  },
  {
    slug: "trainer", icon: TrendingUp, title: "Trener",
    description: roleProfiles.trainer.summary,
    features: [[CalendarDays, roleProfiles["trainer"].features[0]], [CalendarCheck2, roleProfiles["trainer"].features[1]], [HeartPulse, roleProfiles["trainer"].features[2]], [Trophy, roleProfiles["trainer"].features[3]]],
    cta: "Zobacz rolę trenera",
  },
  {
    slug: "head-rider", icon: Users, title: "Jeździec główny",
    description: roleProfiles["head-rider"].summary,
    features: [[CalendarDays, roleProfiles["head-rider"].features[0]], [Users, roleProfiles["head-rider"].features[1]], [HeartPulse, roleProfiles["head-rider"].features[2]], [WalletCards, roleProfiles["head-rider"].features[3]]],
    cta: "Zobacz rolę jeźdźca głównego",
  },
  {
    slug: "rider", icon: PersonStanding, title: "Jeździec",
    description: roleProfiles.rider.summary,
    features: [[CalendarDays, roleProfiles["rider"].features[0]], [HeartPulse, roleProfiles["rider"].features[1]], [CalendarCheck2, roleProfiles["rider"].features[2]], [NotebookPen, roleProfiles["rider"].features[3]]],
    cta: "Zobacz rolę jeźdźca",
  },
  {
    slug: "groom", icon: Wrench, title: "Luzak",
    description: roleProfiles.groom.summary,
    features: [[CalendarDays, roleProfiles["groom"].features[0]], [CalendarCheck2, roleProfiles["groom"].features[1]], [HeartPulse, roleProfiles["groom"].features[2]], [Wrench, roleProfiles["groom"].features[3]]],
    cta: "Zobacz rolę luzaka",
  },
];

export default function Home() {
  return <main>
    <header className="topbar">
      <a className="brand" href="#" aria-label="Stable360 — strona główna"><img src="/stable360-logo-exact.png" alt="Stable360" /></a>
      <NavMenu />
      <a className="top-cta" href="https://tally.so/r/Z95YEo">Wypróbuj Stable360 <span>→</span></a>
    </header>
    <section className="hero" aria-labelledby="hero-title">
      <video className="hero-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true"><source src="/hero.mp4" type="video/mp4" /></video>
      <div className="video-shade" />
      <div className="hero-content"><h1 id="hero-title">Stajnia działa lepiej,<br />gdy <span>wszystko działa razem.</span></h1><i aria-hidden="true" /><p>Stable360 to kompleksowe narzędzie do zarządzania stajnią:<br className="desktop-break" /> końmi, treningami, zespołem i finansami – w jednym miejscu.</p><a className="hero-cta" id="start" href="https://tally.so/r/Z95YEo">Wypróbuj Stable360 <span>→</span></a></div>
    </section>
    <section className="benefits" aria-label="Korzyści Stable360">{benefits.map((benefit) => { const Icon = benefit.icon; return <div className="benefit" key={benefit.title}><span className="benefit-icon" aria-hidden="true"><Icon strokeWidth={1.7} /></span><span><strong>{benefit.title}</strong><small>{benefit.detail}</small></span></div>; })}</section>
    <section className="roles-section" id="role" aria-labelledby="roles-title">
      <div className="roles-top">
        <div className="roles-heading"><p>Dla każdej roli</p><h2 id="roles-title">Jedna stajnia.<br />Wiele ról. <span>Jeden system.</span></h2><div>Stable360 łączy cały zespół w jednym miejscu.<br />Każda rola ma to, czego potrzebuje – nic więcej, nic mniej.</div></div>
        <RoleQuiz />
      </div>
      <div className="roles-grid">{roles.map((role) => { const RoleIcon = role.icon; return <article className={`role-card ${role.slug}`} key={role.slug}>
        <div className="role-intro"><span className="role-main-icon" aria-hidden="true"><RoleIcon strokeWidth={1.7} /></span><div><h3>{role.title}</h3><p>{role.description}</p></div></div>
        <ul>{role.features.map(([FeatureIcon, label]) => { const Icon = FeatureIcon; return <li key={String(label)}><Icon aria-hidden="true" strokeWidth={1.7} /><span>{String(label)}</span></li>; })}</ul>
        <a href={`/role/${role.slug}`}>{role.cta}<ArrowRight aria-hidden="true" /></a>
      </article>; })}</div>
      <a className="all-roles" href="/role"><UserRound aria-hidden="true" />Zobacz wszystkie role<ArrowRight aria-hidden="true" /></a>
    </section>
    <section className="control-section" id="funkcje" aria-labelledby="control-title">
      <div className="control-heading"><p>Dlaczego Stable360?</p><h2 id="control-title">Mniej chaosu.<br /><span>Więcej kontroli.</span></h2><div>Stable360 porządkuje codzienne obowiązki, dane i komunikację w stajni,<br />abyś mógł skupić się na tym, co najważniejsze.</div></div>
      <div className="comparison">
        <article className="compare-card without"><div className="compare-title chaos-heading"><span>Bez Stable360</span><h3>Wiele narzędzi.<br /><em>Zero</em> porządku.</h3><p>Gdy każdy używa czegoś innego,<br />zarządzanie stajnią staje się chaotyczne.</p></div>
          <div className="chaos-map" aria-label="Problemy bez Stable360">
            <div className="chaos-lines" aria-hidden="true"><i/><i/><i/><i/><i/></div>
            <div className="chaos-app whatsapp" aria-hidden="true"><MessageCircle /></div><div className="chaos-app excel" aria-hidden="true"><FileSpreadsheet /></div><div className="chaos-app mail" aria-hidden="true"><Mail /></div><div className="chaos-app phone" aria-hidden="true"><Phone /></div>
            <div className="chaos-note" aria-hidden="true">To do:<br />– konie<br />– treningi<br />– rozliczenia</div>
            <div className="chaos-item info"><FileText/><span>Informacje<br />w wielu miejscach</span><CircleAlert/></div>
            <div className="chaos-item calendar"><CalendarDays/><span>Brak przejrzystego<br />planu i kalendarza</span><CircleAlert/></div>
            <div className="chaos-item reports"><PieChart/><span>Trudne rozliczenia<br />i raporty</span><CircleAlert/></div>
            <div className="chaos-item comms"><MessageCircle/><span>Ręczna komunikacja<br />i dużo pomyłek</span><CircleAlert/></div>
            <div className="chaos-item risk"><TriangleAlert/><span>Ryzyko pomyłek<br />i niedopilnowanych zadań</span><CircleAlert/></div>
          </div>
        </article>
        <span className="compare-arrow" aria-hidden="true"><ChevronsRight/></span>
        <article className="compare-card with"><div className="compare-title"><span>Ze Stable360</span><h3>Wszystko w jednym miejscu.<br />Pełna kontrola każdego dnia.</h3></div>
          <div className="system-map" aria-label="Korzyści ze Stable360">
            <div className="orbit" aria-hidden="true" />
            <div className="system-connectors" aria-hidden="true"><i/><i/><i/><i/><i/></div>
            <div className="system-center"><img src="/stable360-logo-exact.png" alt="Stable360" /></div>
            <div className="system-item plan"><i><CalendarCheck2/></i><span>Plan, harmonogramy<br />i zadania pod kontrolą</span></div>
            <div className="system-item finance"><i><BarChart3/></i><span>Przejrzyste finanse<br />i automatyczne raporty</span></div>
            <div className="system-item errors"><i><Shield/></i><span>Mniej błędów,<br />więcej spokoju i czasu</span></div>
            <div className="system-item messages"><i><MessageCircle/></i><span>Szybka komunikacja<br />w zespole i ze stajnią</span></div>
            <div className="system-item one"><i><Monitor/></i><span>Wszystko w jednym,<br />uporządkowanym systemie</span></div>
          </div>
        </article>
      </div>
      <a className="control-cta" href="#funkcje">Zobacz jak działa Stable360<ArrowRight aria-hidden="true" /></a>
    </section>
    <section className="process-section" id="wdrozenie" aria-labelledby="process-title">
      <div className="process-heading"><p>Jak to działa?</p><h2 id="process-title">3 proste kroki do <span>lepszej</span><br />organizacji stajni.</h2></div>
      <div className="process-flow">
        <article><b>1</b><i><UserPlus /></i><h3>Stwórz swoją stajnię</h3><p>Załóż konto, dodaj stajnię<br />i zaproś swój zespół.</p></article>
        <span className="process-link" aria-hidden="true"><i /><ArrowRight /></span>
        <article><b>2</b><i><SlidersHorizontal /></i><h3>Ustaw i dopasuj</h3><p>Skonfiguruj uprawnienia, konie,<br />boksy, treningi i finanse.</p></article>
        <span className="process-link" aria-hidden="true"><i /><ArrowRight /></span>
        <article><b>3</b><i><Smartphone /></i><h3>Działaj pod kontrolą</h3><p>Korzystaj z jednego systemu każdego dnia<br />— na telefonie i komputerze.</p></article>
      </div>
      <a className="process-page-link" href="/wdrozenie">Zobacz dokładniej <ArrowRight /></a>
    </section>
    <section className="faq-section" id="faq" aria-labelledby="faq-title">
      <div className="faq-heading"><p>FAQ</p><h2 id="faq-title">Najczęstsze pytania<span>.</span></h2><div>Masz pytanie? Sprawdź, czy znajdziesz odpowiedź poniżej.</div></div>
      <div className="faq-list">
        <details open><summary><i/><strong>Czym jest Stable360?</strong><span/></summary><p>Stable360 to aplikacja zaprojektowana dla stajni, trenerów, jeźdźców i właścicieli koni.<br />Pomaga w organizacji codziennych zadań, treningów, finansów i komunikacji – wszystko w jednym miejscu.</p></details>
        <details><summary><i/><strong>Dla kogo jest Stable360?</strong><span/></summary><p>Dla managerów stajni, właścicieli koni, trenerów, jeźdźców głównych, jeźdźców i luzaków. Role można łączyć na jednym koncie, zgodnie z obowiązkami i uprawnieniami w danej stajni.</p></details>
        <details><summary><i/><strong>Czy mogę przetestować Stable360 przed zakupem?</strong><span/></summary><p>Tak. Wystarczy zapisać się na demo, klikając przycisk „Wypróbuj Stable360”.</p></details>
        <details><summary><i/><strong>Jak wygląda wdrożenie w stajni?</strong><span/></summary><p>Pomagamy skonfigurować stajnię, role zespołu i najważniejsze procesy, aby rozpoczęcie pracy było proste i uporządkowane.</p></details>
        <details><summary><i/><strong>Czy moje dane są bezpieczne?</strong><span/></summary><p>Stable360 zostało zaprojektowane tak, aby chronić dane stajni i udostępniać je wyłącznie uprawnionym osobom.</p></details>
        <details><summary><i/><strong>Na jakich urządzeniach działa Stable360?</strong><span/></summary><p>Z systemu możesz korzystać w przeglądarce internetowej oraz na urządzeniach mobilnych.</p></details>
      </div>
      <div className="faq-contact"><Headphones aria-hidden="true"/><span><strong>Nie znalazłeś odpowiedzi?</strong><small>Napisz do nas – chętnie pomożemy.</small></span><a href="#kontakt">Skontaktuj się z nami<ArrowRight aria-hidden="true"/></a></div>
    </section>
    <section className="final-cta" id="kontakt" aria-labelledby="final-cta-title">
      <img src="/final-cta-horse.jpg" alt="Koń tarzający się na piaszczystym wybiegu" />
      <div className="final-cta-shade" aria-hidden="true" />
      <div className="final-cta-content">
        <p>Stajnia. Ludzie. Konie. Wszystko w jednym miejscu.</p>
        <h2 id="final-cta-title">Twoja stajnia może<br />działać <span>prościej.</span></h2>
        <i aria-hidden="true" />
        <div>Mniej chaosu, więcej czasu na to, co naprawdę ważne.<br />Stable360 uporządkuje codzienność w Twojej stajni.</div>
        <a href="https://tally.so/r/Z95YEo">Wypróbuj Stable360 <ArrowRight aria-hidden="true" /></a>
        <small><ShieldCheck aria-hidden="true" />45 dni za darmo <b>•</b> Bez zobowiązań <b>•</b> Wsparcie na każdym etapie</small>
      </div>
    </section>
  </main>;
}
