import { ArrowRight, Check, Crown, Layers, PersonStanding, TrendingUp, UserRound, Users, Wrench } from "lucide-react";
import SubpageHeader from "../SubpageHeader";
import RoleQuiz from "../RoleQuiz";
import { roleProfiles, type RoleSlug } from "../role-data";

const allRoles: { slug: RoleSlug; icon: typeof Crown }[] = [
  { slug: "manager", icon: Crown }, { slug: "owner", icon: UserRound },
  { slug: "trainer", icon: TrendingUp }, { slug: "head-rider", icon: Users },
  { slug: "rider", icon: PersonStanding }, { slug: "groom", icon: Wrench },
];

export default function RolesPage() {
  return <main className="roles-page">
    <SubpageHeader />
    <section className="roles-page-hero"><p>Wszystkie role Stable360</p><h1>Różne obowiązki.<br /><span>Wspólny plan.</span></h1><div>Poznaj sześć ról i wybierz zakres pracy, który do Ciebie pasuje.<br />Jeśli pełnisz kilka funkcji, połącz je na jednym koncie.</div></section>
    <section className="all-role-grid" aria-label="Role w Stable360">{allRoles.map(({ slug, icon: Icon }, index) => {
      const role = roleProfiles[slug];
      return <article id={slug} className={`all-role-card ${slug}`} key={slug}>
        <div className="all-role-icon"><Icon aria-hidden="true" /></div><div className="all-role-number">0{index + 1}</div>
        <h2>{role.title}</h2><small className="role-focus">{role.focus}</small><p>{role.summary}</p>
        <ul>{role.tasks.map(task => <li key={task}><Check aria-hidden="true" />{task}</li>)}</ul>
        <div className="role-card-difference"><strong>Co wyróżnia tę rolę?</strong><p>{role.difference}</p></div>
        <a href={`/role/${slug}`}>Poznaj tę rolę<ArrowRight aria-hidden="true" /></a>
      </article>;
    })}</section>
    <section className="roles-combine"><Layers aria-hidden="true" /><div><small>Role można łączyć</small><h2>Wybieraj według obowiązków, nie jednego tytułu.</h2><p>Masz własnego konia i regularnie jeździsz? Połącz rolę właściciela i jeźdźca. Prowadzisz stajnię oraz treningi? Wybierz managera i trenera. Jeśli dodatkowo rozpisujesz pracę koni zespołu, dodaj jeźdźca głównego.</p><p>Zakres widocznych danych i funkcji zależy od uprawnień przyznanych w danej stajni.</p></div></section>
    <section className="roles-page-cta" id="test-roli"><div><h2>Dobierz role do swojej codzienności.</h2><p>Odpowiedz na 10 pytań o konkretne zadania. Otrzymasz rekomendację, uzasadnienie i możliwość dopasowania zestawu.</p></div><RoleQuiz /></section>
  </main>;
}
