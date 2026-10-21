export type RoleSlug = "manager" | "owner" | "trainer" | "head-rider" | "rider" | "groom";

type RoleProfile = {
  title: string;
  focus: string;
  lead: string;
  summary: string;
  tasks: string[];
  features: [string, string, string, string];
  difference: string;
  example: string;
  benefits: { title: string; detail: string }[];
};

export const roleProfiles: Record<RoleSlug, RoleProfile> = {
  manager: {
    title: "Manager stajni",
    focus: "Organizacja stajni i jej rozliczenia",
    lead: "Uporządkuj części stajni, ludzi, padoki i rozliczenia.",
    summary: "Organizujesz stajnię: dzielisz ją na części, przypisujesz konie i osoby oraz ustalasz ich role. Planujesz grupy na padokach i karuzeli, a w rozliczeniach kontrolujesz pakiety boksów, dodatkowe koszty i wpłaty.",
    tasks: [
      "Tworzysz części stajni i przypisujesz do nich konie, właścicieli oraz pracowników; każdej osobie ustawiasz role w danej części.",
      "Układasz grupy i godziny wyjść na padoki oraz karuzelę, uwzględniając ustawienia koni dotyczące pogody.",
      "Przygotowujesz miesięczne rozliczenia koni: pakiety boksów, dodatkowe pozycje, rabaty i częściowe wpłaty.",
      "Sprawdzasz statusy rozliczeń i eksportujesz zestawienia do PDF lub Excela.",
    ],
    features: ["Części stajni, osoby i role", "Grupy na padokach i karuzeli", "Pakiety boksów, koszty i wpłaty", "Eksport rozliczeń do PDF i Excela"],
    difference: "Manager organizuje stajnię, jej części i rozliczenia. Jeździec główny skupia się na pracy powierzonych mu koni oraz na grafiku swojego zespołu.",
    example: "Dodajesz część pensjonatową, przypisujesz do niej konie i osoby, rozpisujesz grupy na padokach, a na koniec miesiąca przygotowujesz rozliczenia.",
    benefits: [
      { title: "Porządkujesz stajnię", detail: "Części stajni mają przypisane konie, osoby i właściwe role." },
      { title: "Planujesz wyjścia koni", detail: "Karuzela i padoki mają własne grupy oraz godziny." },
      { title: "Rozliczasz miesiąc", detail: "Pakiety boksów, dodatkowe koszty i rabaty trafiają do rozliczenia konia." },
      { title: "Sprawdzasz wpłaty", detail: "Widzisz status płatności i możesz wyeksportować zestawienie." },
    ],
  },
  owner: {
    title: "Właściciel",
    focus: "Karta własnego konia i organizacja opieki",
    lead: "Zadbaj o informacje o swoim koniu i opiekę podczas wyjazdu.",
    summary: "Prowadzisz informacje o własnym koniu: zdrowie, dietę, ruch i dokumenty. Zaznaczasz nieobecności, wskazujesz osobę do opieki oraz obliczasz, na jak długo wystarczy zapas paszy.",
    tasks: [
      "Uzupełniasz kartę własnego konia: dane, terminy zabiegów, dietę, zasady ruchu, wyposażenie i dokumenty.",
      "Zapisujesz jednorazową lub powtarzalną nieobecność i wybierasz osobę, która zajmie się koniem w tym czasie.",
      "Przekazujesz opiekunowi dodatkowe instrukcje dotyczące konia na okres swojej nieobecności.",
      "W kalkulatorze paszy podajesz zapas i dzienne zużycie, sprawdzasz szacowany termin wyczerpania oraz ustawiasz przypomnienie.",
    ],
    features: ["Zdrowie, dieta, ruch i dokumenty", "Nieobecności i wybór opiekuna", "Instrukcje opieki podczas wyjazdu", "Kalkulator zapasu paszy"],
    difference: "Rola właściciela służy prowadzeniu spraw własnego konia i organizowaniu jego opieki. Jeśli także realizujesz jazdy z grafiku, możesz połączyć ją z rolą jeźdźca.",
    example: "Wyjeżdżasz na tydzień: zapisujesz nieobecność, wybierasz opiekuna i dodajesz instrukcje. Przed wyjazdem sprawdzasz, czy koniowi wystarczy paszy.",
    benefits: [
      { title: "Uzupełniasz kartę konia", detail: "Dane, zdrowie, dieta, ruch i dokumenty są w jednym miejscu." },
      { title: "Planujesz nieobecność", detail: "Wybierasz termin wyjazdu lub regularnie powtarzający się okres." },
      { title: "Wskazujesz opiekuna", detail: "Przekazujesz wybranej osobie instrukcje na czas nieobecności." },
      { title: "Pilnujesz zapasu paszy", detail: "Obliczasz, na ile dni wystarczy pasza, i ustawiasz przypomnienie." },
    ],
  },
  trainer: {
    title: "Trener",
    focus: "Treningi podopiecznych, konie i zawody",
    lead: "Umawiaj treningi i organizuj udział podopiecznych w zawodach.",
    summary: "Umawiasz treningi podopiecznych: wybierasz termin, miejsce, jeźdźca i konia oraz ustawiasz powtarzanie zajęć. Prowadzisz własną listę koni, a przy zawodach zarządzasz zapisami, uczestnikami i komunikatami.",
    tasks: [
      "Ustalasz stajnię, datę, godzinę, czas trwania i miejsce treningu oraz przypisujesz trenera, konia i jeźdźca.",
      "Zapisujesz trening jednorazowy lub cykliczny, określasz dni powtarzania i dodajesz notatkę.",
      "Dodajesz konie do swojej listy i przypisujesz im właścicieli; korzystasz z tej listy przy umawianiu treningów.",
      "Tworzysz zawody, ustalasz termin i limit zapisów, sprawdzasz uczestników oraz publikujesz komunikaty dotyczące wydarzenia.",
    ],
    features: ["Terminy i uczestnicy treningów", "Treningi jednorazowe i cykliczne", "Lista koni i ich właścicieli", "Zawody, zapisy i komunikaty"],
    difference: "Trener organizuje treningi podopiecznych i wydarzenia sportowe. Jeździec główny rozpisuje codzienną pracę powierzonych mu koni oraz przydziela ją osobom w swoim zespole.",
    example: "Ustalasz cotygodniowy trening konkretnej pary koń–jeździec, wybierasz miejsce i godzinę. Przed zawodami otwierasz zapisy i sprawdzasz listę uczestników.",
    benefits: [
      { title: "Umawiasz trening", detail: "W jednym formularzu wybierasz termin, miejsce i uczestników." },
      { title: "Ustawiasz powtarzanie", detail: "Regularne zajęcia planujesz jako trening cykliczny." },
      { title: "Prowadzisz listę koni", detail: "Dodajesz konia i przypisujesz mu właściciela." },
      { title: "Organizujesz zawody", detail: "Zarządzasz zapisami, uczestnikami i komunikatami wydarzenia." },
    ],
  },
  "head-rider": {
    title: "Jeździec główny",
    focus: "Praca powierzonych koni i własnego zespołu",
    lead: "Rozpisuj pracę koni i przydzielaj ją swojemu zespołowi.",
    summary: "Prowadzisz konie swoje i klientów: układasz ich codzienną pracę, przydzielasz jazdy osobom w zespole i dbasz o aktualne karty koni. Rozliczasz też usługi, treningi i koszty związane z prowadzonymi końmi.",
    tasks: [
      "Układasz dzienny i tygodniowy grafik pracy koni: jazdy, treningi i pozostałe aktywności.",
      "Przypisujesz aktywności konkretnym osobom i widzisz pracę całego swojego zespołu w jednym grafiku.",
      "Uzupełniasz karty prowadzonych koni: zdrowie, dietę, zasady ruchu, wyposażenie, informacje treningowe i dokumenty.",
      "Zestawiasz koszty i przychody związane z końmi klientów, treningami oraz zawodami i przygotowujesz rozliczenia.",
    ],
    features: ["Dzienny i tygodniowy grafik koni", "Przydzielanie jazd osobom z zespołu", "Karty prowadzonych koni", "Usługi i rozliczenia z klientami"],
    difference: "Jeździec główny odpowiada za organizację pracy swoich koni i zespołu. Jeździec wykonuje przypisane jazdy, trener prowadzi treningi podopiecznych, a manager organizuje całą stajnię.",
    example: "Rozpisujesz pracę kilku koni na cały tydzień, przydzielasz jazdy osobom z zespołu, aktualizujesz zalecenia w kartach koni i rozliczasz wykonane usługi z klientami.",
    benefits: [
      { title: "Układasz grafik koni", detail: "Planujesz aktywności w widoku dnia lub tygodnia." },
      { title: "Rozdzielasz jazdy", detail: "Przypisujesz konkretną pracę osobom ze swojego zespołu." },
      { title: "Prowadzisz karty koni", detail: "Aktualizujesz zdrowie, dietę, ruch i pozostałe informacje o koniach." },
      { title: "Rozliczasz klientów", detail: "Porządkujesz koszty, usługi, treningi i zawody związane z końmi." },
    ],
  },
  rider: {
    title: "Jeździec",
    focus: "Przypisane jazdy, konie i zadania",
    lead: "Sprawdź, na którym koniu jeździsz i co masz dziś do zrobienia.",
    summary: "Realizujesz jazdy i treningi z przypisanego grafiku. Sprawdzasz konie na dany dzień, ich status przygotowania oraz zadania przekazane przez managera; po wykonaniu oznaczasz je jako ukończone.",
    tasks: [
      "Sprawdzasz przypisane jazdy, treningi i inne aktywności w dziennym lub tygodniowym grafiku koni.",
      "Na liście koni widzisz, które są gotowe, a które jeszcze wymagają przygotowania.",
      "Odbierasz zadania przypisane przez managera i oznaczasz ich wykonanie; możesz też wrócić do listy ukończonych.",
      "Dodajesz własne zadania, żeby uporządkować swoją pracę przy koniach.",
    ],
    features: ["Podgląd przypisanych jazd", "Konie gotowe i do przygotowania", "Zadania od managera", "Własna lista zadań"],
    difference: "Jeździec realizuje przydzielone jazdy i zadania. Jeździec główny układa grafik oraz przydziela pracę całemu zespołowi; luzak skupia się na przygotowaniu koni i opiece.",
    example: "Rano sprawdzasz, na których koniach masz jeździć. Na liście widzisz ich gotowość, a po pracy odhaczasz wykonane zadania.",
    benefits: [
      { title: "Znasz plan jazd", detail: "W grafiku sprawdzasz konie i aktywności przypisane na dany dzień." },
      { title: "Widzisz gotowość koni", detail: "Lista rozdziela konie gotowe i wymagające przygotowania." },
      { title: "Realizujesz zadania", detail: "Odbierasz zadania od managera i oznaczasz ich ukończenie." },
      { title: "Porządkujesz swoją pracę", detail: "Dodajesz własne zadania i sprawdzasz listę wykonanych." },
    ],
  },
  groom: {
    title: "Luzak",
    focus: "Przygotowanie koni i codzienne czynności",
    lead: "Przygotuj właściwe konie na czas i odhacz wykonane czynności.",
    summary: "Przygotowujesz konie i wykonujesz codzienne czynności zgodnie z planem zespołu. Sprawdzasz grafik od jeźdźca głównego, pracujesz z checklistami i oznaczasz, które konie są już gotowe.",
    tasks: [
      "W grafiku od jeźdźca głównego sprawdzasz, które konie i na kiedy trzeba przygotować.",
      "Wykonujesz przydzielone czynności przy koniach i odhaczasz je na checklistach.",
      "Na liście swojej zmiany sprawdzasz konie wymagające przygotowania i zmieniasz ich status na gotowe.",
      "Przełączasz widok dnia lub tygodnia i filtrujesz grafik po koniu, aby sprawdzić jego najbliższe aktywności.",
    ],
    features: ["Podgląd grafiku od jeźdźca głównego", "Checklisty czynności przy koniach", "Konie przypisane do zmiany", "Oznaczanie gotowości koni"],
    difference: "Luzak przygotowuje konie i realizuje czynności z planu oraz checklist. Jeździec wykonuje jazdy, a jeździec główny układa grafik pracy koni i zespołu.",
    example: "Widzisz trening konia na 10:00, przygotowujesz go zgodnie z planem, odhaczasz czynności i zmieniasz status konia na gotowy.",
    benefits: [
      { title: "Znasz godziny przygotowania", detail: "Grafik pokazuje aktywności zaplanowane przez jeźdźca głównego." },
      { title: "Pracujesz z checklistą", detail: "Odhaczasz kolejne wykonane czynności przy koniach." },
      { title: "Widzisz konie na zmianę", detail: "Sprawdzasz listę koni przypisanych do Twojej pracy." },
      { title: "Potwierdzasz gotowość", detail: "Po przygotowaniu przenosisz konia na listę gotowych." },
    ],
  },
};
