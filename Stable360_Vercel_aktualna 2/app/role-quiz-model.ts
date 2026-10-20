import type { RoleSlug } from "./role-data";

type Signal = { score: number; reason: string };
export type QuizOption = { label: string; detail?: string; signals?: Partial<Record<RoleSlug, Signal>>; exclusive?: boolean; primary?: RoleSlug };
type QuizQuestion = { title: string; hint: string; multi?: boolean; coreRole?: RoleSlug; options: QuizOption[] };
export const roleOrder: RoleSlug[] = ["manager", "owner", "trainer", "head-rider", "rider", "groom"];
const signal = (role: RoleSlug, score: number, reason: string) => ({ [role]: { score, reason } });
const none: QuizOption = { label: "Żadne z powyższych", exclusive: true };

export const questions: QuizQuestion[] = [
  { coreRole: "owner", title: "Czy jesteś właścicielem lub współwłaścicielem konia?", hint: "Chodzi o własność konia, niezależnie od tego, kto na nim jeździ.", options: [
    { label: "Tak, mam własnego konia lub udział we własności", detail: "Chcę znać jego plan, stan zdrowia, opiekę i koszty.", signals: signal("owner", 6, "Jesteś właścicielem lub współwłaścicielem konia.") },
    { label: "Wspieram właściciela w sprawach jego konia", detail: "Pomagam w kontakcie ze stajnią lub sprawdzaniu informacji.", signals: signal("owner", 2, "Wspierasz właściciela w sprawach jego konia.") },
    { label: "Nie, konie należą do innych osób" },
  ]},
  { coreRole: "rider", title: "Czy osobiście jeździsz i realizujesz plan treningowy?", hint: "Uwzględnij własne konie i konie powierzone Ci do jazdy.", options: [
    { label: "Tak, regularnie jeżdżę i realizuję swój plan", detail: "Potrzebuję wiedzieć, kiedy i na którym koniu mam jeździć.", signals: signal("rider", 6, "Regularnie realizujesz własne jazdy i treningi.") },
    { label: "Jeżdżę okazjonalnie lub w zastępstwie", signals: signal("rider", 2, "Zdarza Ci się realizować jazdy lub zastępować innych jeźdźców.") },
    { label: "Nie, moja praca nie obejmuje jazdy" },
  ]},
  { coreRole: "trainer", title: "Czy prowadzisz treningi innych jeźdźców?", hint: "Prowadzenie treningu oznacza ustalanie celów, udzielanie wskazówek i ocenę postępów.", options: [
    { label: "Tak, prowadzę regularnych podopiecznych", detail: "Ustalam cele, prowadzę zajęcia i monitoruję rozwój pary koń–jeździec.", signals: signal("trainer", 6, "Prowadzisz regularne treningi i rozwój podopiecznych.") },
    { label: "Zdarza mi się prowadzić trening lub zastępować trenera", signals: signal("trainer", 2, "Okazjonalnie prowadzisz treningi innych jeźdźców.") },
    { label: "Nie, uczestniczę w treningach lub zajmuję się innymi sprawami" },
  ]},
  { coreRole: "head-rider", title: "Czy układasz pracę koni i przydzielasz ją innym osobom?", hint: "Chodzi o organizację jazd, ruchu, odpoczynku i zadań zespołu przy koniach.", options: [
    { label: "Tak, odpowiadam za codzienny grafik koni i zespołu", detail: "Decyduję, kto pracuje z danym koniem, i sprawdzam wykonanie planu.", signals: signal("head-rider", 6, "Układasz grafik pracy koni i koordynujesz osoby, które go realizują.") },
    { label: "Pomagam w grafiku lub koordynuję pracę w zastępstwie", signals: signal("head-rider", 2, "Pomagasz koordynować grafik pracy koni i zespołu.") },
    { label: "Nie, planuję tylko własne jazdy lub wykonuję przydzielone zadania" },
  ]},
  { coreRole: "manager", title: "Czy odpowiadasz za działanie stajni jako organizacji?", hint: "Uwzględnij zespół, podział obowiązków, strukturę stajni, zasoby i rozliczenia.", options: [
    { label: "Tak, zarządzam stajnią lub jej wydzieloną częścią", detail: "Podejmuję decyzje organizacyjne, koordynuję ludzi i sprawy stajni.", signals: signal("manager", 6, "Odpowiadasz za organizację stajni lub jej wydzielonej części.") },
    { label: "Wspieram managera w wybranych sprawach organizacyjnych", signals: signal("manager", 2, "Wspierasz managera w organizacji stajni.") },
    { label: "Nie, odpowiadam za swoje konie, treningi lub przydzielone zadania" },
  ]},
  { coreRole: "groom", title: "Czy wykonujesz codzienną opiekę nad końmi?", hint: "Pomyśl o karmieniu, pielęgnacji, przygotowaniu do jazdy, padokach i karuzeli.", options: [
    { label: "Tak, to regularna część mojej pracy", detail: "Opiekuję się przydzielonymi końmi i realizuję ich plan dnia.", signals: signal("groom", 6, "Regularnie wykonujesz codzienną opiekę nad przydzielonymi końmi.") },
    { label: "Pomagam okazjonalnie lub zajmuję się tylko własnym koniem", signals: signal("groom", 2, "Samodzielnie wykonujesz część opieki nad końmi.") },
    { label: "Nie, opiekę wykonują inne osoby" },
  ]},
  { title: "Które obowiązki związane z planem wykonujesz osobiście?", hint: "Zaznacz wszystkie pasujące odpowiedzi. Wybieraj zadania, za które faktycznie odpowiadasz.", multi: true, options: [
    { label: "Sprawdzam terminy opieki i wizyt dotyczących mojego konia", signals: signal("owner", 3, "Śledzisz terminy i opiekę dotyczącą własnego konia.") },
    { label: "Realizuję swoje jazdy i odczytuję zalecenia treningowe", signals: signal("rider", 3, "Korzystasz z własnego planu jazd i zaleceń treningowych.") },
    { label: "Ustalam cele i umawiam treningi podopiecznych", signals: signal("trainer", 3, "Ustalasz cele i terminy treningów podopiecznych.") },
    { label: "Rozpisuję ruch koni oraz przydzielam jeźdźców i zadania", signals: signal("head-rider", 3, "Rozdzielasz pracę z końmi między jeźdźców i zespół.") },
    { label: "Koordynuję pracowników, zasoby i kalendarz stajni", signals: signal("manager", 3, "Koordynujesz pracowników, zasoby i kalendarz stajni.") },
    { label: "Wykonuję karmienie, pielęgnację, padoki lub karuzelę", signals: signal("groom", 3, "Realizujesz zadania opiekuńcze zgodnie z planem koni.") }, none,
  ]},
  { title: "Za jakie rozliczenia odpowiadasz?", hint: "Możesz wybrać kilka obszarów. Samo opłacanie własnych rachunków nie oznacza zarządzania stajnią.", multi: true, options: [
    { label: "Sprawdzam i opłacam koszty mojego konia", signals: signal("owner", 3, "Kontrolujesz i opłacasz koszty własnego konia.") },
    { label: "Rozliczam treningi z podopiecznymi", signals: signal("trainer", 3, "Rozliczasz prowadzone treningi z podopiecznymi.") },
    { label: "Rozliczam pracę przy koniach klientów i swojego zespołu", signals: signal("head-rider", 3, "Prowadzisz rozliczenia związane z pracą koni klientów i zespołu.") },
    { label: "Kontroluję opłaty, usługi i rozliczenia stajni", signals: signal("manager", 3, "Odpowiadasz za rozliczenia usług i funkcjonowania stajni.") },
    { label: "Nie zajmuję się rozliczeniami", exclusive: true },
  ]},
  { title: "Jakie informacje przekazujesz lub sprawdzasz na co dzień?", hint: "Zaznacz wszystkie sytuacje, które dotyczą Twojej pracy.", multi: true, options: [
    { label: "Pytam o mojego konia i ustalam jego potrzeby ze stajnią", signals: signal("owner", 3, "Ustalasz ze stajnią potrzeby własnego konia.") },
    { label: "Przekazuję obserwacje po własnej jeździe", signals: signal("rider", 3, "Przekazujesz obserwacje po zrealizowanej jeździe.") },
    { label: "Daję podopiecznym wskazówki i podsumowuję ich postępy", signals: signal("trainer", 3, "Przekazujesz wskazówki i oceniasz postępy podopiecznych.") },
    { label: "Przekazuję zespołowi plan pracy koni i sprawdzam realizację", signals: signal("head-rider", 3, "Przekazujesz plan pracy koni i kontrolujesz jego realizację.") },
    { label: "Ustalam zasady organizacji i rozwiązuję sprawy stajni", signals: signal("manager", 3, "Podejmujesz ustalenia organizacyjne i rozwiązujesz sprawy stajni.") },
    { label: "Oznaczam wykonanie opieki i zgłaszam obserwacje o koniach", signals: signal("groom", 3, "Potwierdzasz opiekę i zgłaszasz obserwacje dotyczące koni.") }, none,
  ]},
  { title: "Który obszar jest Twoją główną odpowiedzialnością?", hint: "Wybierz jeden obszar jako główny. Pozostałe obowiązki uwzględnimy jako role uzupełniające.", options: [
    { label: "Organizacja i działanie stajni", primary: "manager" },
    { label: "Sprawy mojego konia", primary: "owner" },
    { label: "Trening i rozwój podopiecznych", primary: "trainer" },
    { label: "Grafik pracy koni i mojego zespołu", primary: "head-rider" },
    { label: "Moje jazdy i treningi", primary: "rider" },
    { label: "Codzienna opieka nad końmi", primary: "groom" },
    { label: "Kilka obszarów jest równie ważnych / jeszcze nie wiem" },
  ]},
];

export function toggleAnswer(selected: number[], index: number, question: QuizQuestion): number[] {
  const option = question.options[index];
  if (!option) return selected;
  if (!question.multi || option.exclusive) return [index];
  const compatible = selected.filter(i => !question.options[i]?.exclusive);
  return compatible.includes(index) ? compatible.filter(i => i !== index) : [...compatible, index];
}

export function getRoleRecommendations(answers: number[][]) {
  const scores = Object.fromEntries(roleOrder.map(role => [role, 0])) as Record<RoleSlug, number>;
  const core = { ...scores };
  const reasons = Object.fromEntries(roleOrder.map(role => [role, [] as string[]])) as Record<RoleSlug, string[]>;
  let preferred: RoleSlug | undefined;
  questions.forEach((question, q) => {
    for (const i of new Set(answers[q] ?? [])) {
      const option = question.options[i];
      if (!option) continue;
      if (option.primary) preferred = option.primary;
      for (const role of roleOrder) {
        const evidence = option.signals?.[role];
        if (!evidence) continue;
        scores[role] += evidence.score;
        reasons[role].push(evidence.reason);
        if (question.coreRole === role) core[role] += evidence.score;
      }
    }
  });
  // Recommend a role only after the person affirms the underlying responsibility.
  // Supporting duties can confirm an occasional role; ownership never implies riding.
  const matched = roleOrder.filter(role => core[role] > 0 && scores[role] >= 6);
  const maximum = (role: RoleSlug) => questions.reduce((sum, question) => {
    const values = question.options.map(option => option.signals?.[role]?.score ?? 0);
    return sum + (question.multi ? values.reduce((a, b) => a + b, 0) : Math.max(0, ...values));
  }, 0);
  matched.sort((a, b) => scores[b] / maximum(b) - scores[a] / maximum(a));
  const primary = preferred && matched.includes(preferred) ? preferred : matched[0];
  const roles = primary ? [primary, ...matched.filter(role => role !== primary)] : [];
  return { primary, roles, scores, reasons };
}
