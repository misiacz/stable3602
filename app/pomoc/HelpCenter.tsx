"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Bot, BriefcaseBusiness, CalendarDays, CircleHelp, GraduationCap, Mail, MessageCircle, Rocket, Search, Send, Sparkles, UserRound, Users, WalletCards, X } from "lucide-react";

const categories = [
  [Rocket,"Pierwsze kroki","Zacznij pracę ze Stable360","pierwsze-kroki"],
  [BriefcaseBusiness,"Manager","Stajnia, zespół i finanse","manager"],
  [UserRound,"Właściciel","Konie, płatności i rozliczenia","wlasciciel"],
  [GraduationCap,"Trener","Podopieczni, treningi i komunikacja","trener"],
  [Users,"Jeździec główny","Grafik, konie, zespół i rozliczenia","jezdziec-glowny"],
  [BookOpen,"Jeździec / Luzak","Plan dnia, konie i zadania","jezdziec-luzak"],
] as const;

const articles = [
  ["Jak edytować kartę konia?","Właściciel · 4 min czytania",UserRound],
  ["Nie dostałem zaproszenia do stajni","Pierwsze kroki · 2 min czytania",Mail],
  ["Jak zaprosić pracowników?","Manager · 4 min czytania",Users],
  ["Jak dodać trening w harmonogramie?","Trener · 3 min czytania",CalendarDays],
  ["Jak działają rozliczenia?","Właściciel · 5 min czytania",WalletCards],
] as const;

const roleArticles: Record<string, string[]> = {
  "Pierwsze kroki": [
    "Jak założyć konto w Stable360?",
    "Jak dołączyć do stajni z zaproszenia?",
    "Jak wybrać i skonfigurować swoją rolę?",
    "Pierwsze logowanie — od czego zacząć?",
  ],
  "Manager": [
    "Jak dodać nowego konia do stajni?",
    "Jak zaprosić pracowników i nadać im role?",
    "Jak utworzyć tygodniowy grafik stajni?",
    "Jak przydzielać zadania całemu zespołowi?",
    "Jak sprawdzić finanse i raporty stajni?",
  ],
  "Właściciel": [
    "Jak edytować kartę konia jako właściciel?",
    "Jak zgłosić nieobecność i wskazać opiekuna?",
    "Jak działa kalkulator paszy?",
    "Gdzie sprawdzić rozliczenia i płatności?",
    "Jak sprawdzić zdrowie, dietę i ruch konia?",
  ],
  "Trener": [
    "Jak ustawić dostępność treningów?",
    "Jak zaplanować trening podopiecznego?",
    "Jak dodać notatkę po treningu?",
    "Jak śledzić postępy jeźdźca i konia?",
    "Jak zmienić lub odwołać trening?",
  ],
  "Jeździec główny": [
    "Jak ułożyć grafik koni dla całego zespołu?",
    "Jak zarządzać kartami koni?",
    "Jak dodać pozycję, rabat lub zawody do rozliczenia?",
    "Jak przydzielać zadania jeźdźcom i luzakom?",
    "Jak zmieniać kolejność koni w grafiku?",
  ],
  "Jeździec / Luzak": [
    "Jak sprawdzić swój grafik koni?",
    "Jak korzystać z listy gotowych koni?",
    "Gdzie znaleźć zadania od managera?",
    "Jak oznaczyć zadanie jako ukończone?",
    "Jak korzystać z checklisty dziennej?",
    "Jak sprawdzić jazdy, treningi i konie na dany dzień?",
  ],
};

const updates = [
  ["Nowe: Raporty finansowe","Eksportuj i analizuj finanse stajni w kilku kliknięciach.","2 dni temu"],
  ["Aktualizacja: Wiadomości grupowe","Komunikuj się szybciej z całym zespołem.","5 dni temu"],
  ["Porada: Ustawienia powiadomień","Dostosuj powiadomienia do swoich potrzeb.","1 tydzień temu"],
] as const;

type ChatMessage = { id: number; from: "bot" | "user"; text: string };

function chatbotAnswer(question: string) {
  const text = question.toLocaleLowerCase("pl");
  if (text.includes("koń") || text.includes("konia") || text.includes("konie")) return "Kartę konia znajdziesz w zakładce „Konie”. W zależności od roli zobaczysz tam zdrowie, dietę, ruch, treningi, dokumenty albo listę koni przypisanych na dziś.";
  if (text.includes("grafik") || text.includes("jazd") || text.includes("trening")) return "Wejdź w „Grafik”. Jeździec główny może układać plan, a jeździec i luzak widzą przypisane im jazdy, treningi oraz konie. Możesz przełączać widok dnia i tygodnia.";
  if (text.includes("zadani")) return "Zadania znajdziesz w menu „Więcej” → „Zadania”. Możesz przełączać listę „Do zrobienia” i „Ukończone”, a wykonane zadanie odhaczyć jednym kliknięciem.";
  if (text.includes("rozlicz") || text.includes("płat") || text.includes("koszt")) return "Rozliczenia są dostępne dla jeźdźca głównego. Wybierz konia i miesiąc, aby zobaczyć koszty, przychody, zawody, treningi i dodać nową pozycję lub rabat.";
  if (text.includes("nieobec")) return "Właściciel może dodać nieobecność w swoim module: wybiera konia, termin, godziny oraz osobę, która przejmie opiekę. Po zapisaniu opiekun otrzyma informację.";
  if (text.includes("pasz") || text.includes("karm")) return "Kalkulator paszy właściciela oblicza, na ile dni wystarczy zapas. Podaj wagę worka i dzienne zużycie, a Stable360 wyliczy termin kolejnego zamówienia.";
  if (text.includes("luzak") || text.includes("checklist")) return "Luzak ma dostęp do swojego grafiku koni, checklist oraz listy koni gotowych i wymagających przygotowania. Plan jest tylko do podglądu i pochodzi od jeźdźca głównego.";
  if (text.includes("zapros") || text.includes("konto") || text.includes("logow")) return "Aby dołączyć do stajni, otwórz zaproszenie otrzymane od managera, załóż konto i wybierz przypisaną rolę. Jeśli zaproszenie nie dotarło, poproś managera o wysłanie go ponownie.";
  return "Mogę pomóc w grafiku, koniach, zadaniach, rozliczeniach, nieobecnościach, paszy i rolach w Stable360. Napisz proszę, z czym dokładnie masz problem.";
}

export default function HelpCenter(){
  const [query,setQuery]=useState("");
  const [chatOpen,setChatOpen]=useState(false);
  const [chatInput,setChatInput]=useState("");
  const [chatMessages,setChatMessages]=useState<ChatMessage[]>([{id:1,from:"bot",text:"Cześć! Jestem asystentem Stable360. W czym mogę Ci pomóc?"}]);
  const searchableArticles=useMemo(()=>[
    ...articles.map(([title,meta,Icon])=>({title,meta,Icon})),
    ...Object.entries(roleArticles).flatMap(([role,titles])=>titles.map(title=>({title,meta:`${role} · poradnik`,Icon:BookOpen}))),
  ],[]);
  const results=useMemo(()=>{
    const q=query.trim().toLocaleLowerCase("pl");
    if(!q)return [];
    return searchableArticles.filter(({title,meta})=>(title+" "+meta).toLocaleLowerCase("pl").includes(q));
  },[query,searchableArticles]);
  const sendMessage=(preset?:string)=>{
    const question=(preset??chatInput).trim();
    if(!question)return;
    const now=Date.now();
    setChatMessages(current=>[...current,{id:now,from:"user",text:question},{id:now+1,from:"bot",text:chatbotAnswer(question)}]);
    setChatInput("");
  };

  return <div className="help-shell">
    <section className="help-hero">
      <span>STABLE360 POMOC</span>
      <h1>Jak możemy Ci pomóc?</h1>
      <p>Instrukcje, odpowiedzi i porady dla Ciebie i Twojej stajni.</p>
      <label className="help-search"><Search /><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Wyszukaj np. „Jak dodać konia?”" aria-label="Wyszukaj w pomocy" /></label>
      {query&&<div className="help-search-results" aria-live="polite">{results.length?results.map(({title,meta,Icon})=><a href={title.toLocaleLowerCase("pl").includes("edytować kartę konia")?"/pomoc/wlasciciel/jak-edytowac-karte-konia":"#popularne"} key={`${meta}-${title}`}><Icon/><span><strong>{title}</strong><small>{meta}</small></span><ArrowRight/></a>):<p>Nie znaleźliśmy takiego poradnika. Napisz do nas — pomożemy.</p>}</div>}
    </section>

    <section className="help-categories" aria-label="Kategorie pomocy">
      {categories.map(([Icon,title,copy,slug])=><a href={`/pomoc/${slug}`} key={title}><Icon/><strong>{title}</strong><span>{copy}</span><ArrowRight/></a>)}
    </section>

    <section className="help-feed">
      <div id="popularne" className="help-list">
        <header><h2>Najczęściej czytane</h2><a href="#popularne">Zobacz wszystkie <ArrowRight/></a></header>
        {articles.map(([title,meta,Icon])=><a href={title==="Jak edytować kartę konia?"?"/pomoc/wlasciciel/jak-edytowac-karte-konia":"#kontakt"} key={title}><i><Icon/></i><span><strong>{title}</strong><small>{meta}</small></span><ArrowRight/></a>)}
      </div>
      <div className="help-updates">
        <header><h2>Najnowsze w Stable360</h2><a href="#aktualnosci">Zobacz wszystkie <ArrowRight/></a></header>
        {updates.map(([title,copy,date],index)=><article key={title}><div><strong>{title}</strong><p>{copy}</p><small>{date}</small></div><div className={`help-update-preview preview-${index+1}`}><span></span><span></span><span></span></div></article>)}
      </div>
    </section>

    <section className="help-academy">
      <div><span>STABLE360 ACADEMY</span><h2>Wiedza, która pomaga prowadzić stajnię lepiej.</h2><p>Porady i praktyczne przewodniki o zarządzaniu stajnią — od ludzi, którzy znają ją od środka.</p><a href="#popularne">Przejdź do Akademii <ArrowRight/></a></div>
      <img src="/manager-hero.jpg" alt="Koń w stajni" />
    </section>

    <section className="help-contact" id="kontakt"><i><CircleHelp/></i><div><strong>Nie znalazłeś odpowiedzi?</strong><p>Napisz do nas, chętnie pomożemy.</p></div><a href="mailto:kontakt@stable360.pl">Skontaktuj się z nami <ArrowRight/></a></section>

    <button className={`help-chat-launcher ${chatOpen?"open":""}`} onClick={()=>setChatOpen(value=>!value)} aria-label={chatOpen?"Zamknij chat pomocy":"Otwórz chat pomocy"}>{chatOpen?<X/>:<><span><MessageCircle/></span><b>Zapytaj Stable360</b><i/></>}</button>
    {chatOpen&&<aside className="help-chat" aria-label="Chatbot pomocy Stable360">
      <header><i><Bot/></i><span><b>Asystent Stable360</b><small><i/>Online · odpowiada od razu</small></span><button onClick={()=>setChatOpen(false)} aria-label="Zamknij"><X/></button></header>
      <div className="help-chat-messages">{chatMessages.map(message=><div className={message.from} key={message.id}>{message.from==="bot"&&<Bot/>}<p>{message.text}</p></div>)}</div>
      {chatMessages.length===1&&<div className="help-chat-prompts"><span><Sparkles/>Szybkie pytania</span>{["Jak sprawdzić grafik?","Gdzie są moje zadania?","Jak działa karta konia?"].map(prompt=><button onClick={()=>sendMessage(prompt)} key={prompt}><b>{prompt}</b><ArrowRight/></button>)}</div>}
      <div className="help-chat-input"><input value={chatInput} onChange={event=>setChatInput(event.target.value)} onKeyDown={event=>event.key==="Enter"&&sendMessage()} placeholder="Napisz pytanie…" aria-label="Wiadomość do asystenta"/><button onClick={()=>sendMessage()} aria-label="Wyślij wiadomość"><Send/></button></div>
    </aside>}
  </div>;
}
