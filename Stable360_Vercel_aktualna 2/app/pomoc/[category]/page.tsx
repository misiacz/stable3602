import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, BriefcaseBusiness, GraduationCap, Rocket, UserRound, Users } from "lucide-react";
import SubpageHeader from "../../SubpageHeader";

const headRiderHelp = { title: "Jeździec główny", copy: "Grafik całego zespołu, karty koni, zadania i rozliczenia.", icon: Users, articles: ["Jak ułożyć grafik koni dla całego zespołu?","Jak zarządzać kartami koni?","Jak dodać pozycję, rabat lub zawody do rozliczenia?","Jak przydzielać zadania jeźdźcom i luzakom?","Jak zmieniać kolejność koni w grafiku?"] } as const;
const riderGroomHelp = { title: "Jeździec / Luzak", copy: "Plan dnia, konie, checklisty i zadania w jednym miejscu.", icon: BookOpen, articles: ["Jak sprawdzić swój grafik koni?","Jak korzystać z listy gotowych koni?","Gdzie znaleźć zadania od managera?","Jak oznaczyć zadanie jako ukończone?","Jak korzystać z checklisty dziennej?","Jak sprawdzić jazdy, treningi i konie na dany dzień?"] } as const;

const helpCategories = {
  "pierwsze-kroki": { title: "Pierwsze kroki", copy: "Wszystko, czego potrzebujesz, aby dobrze zacząć pracę ze Stable360.", icon: Rocket, articles: ["Jak założyć konto w Stable360?","Jak dołączyć do stajni z zaproszenia?","Jak wybrać i skonfigurować swoją rolę?","Pierwsze logowanie — od czego zacząć?"] },
  manager: { title: "Manager", copy: "Poradniki o zarządzaniu stajnią, zespołem i finansami.", icon: BriefcaseBusiness, articles: ["Jak dodać nowego konia do stajni?","Jak zaprosić pracowników i nadać im role?","Jak utworzyć tygodniowy grafik stajni?","Jak przydzielać zadania całemu zespołowi?","Jak sprawdzić finanse i raporty stajni?"] },
  wlasciciel: { title: "Właściciel", copy: "Najważniejsze informacje o koniu, opiece i płatnościach.", icon: UserRound, articles: ["Jak edytować kartę konia jako właściciel?","Jak zgłosić nieobecność i wskazać opiekuna?","Jak działa kalkulator paszy?","Gdzie sprawdzić rozliczenia i płatności?","Jak sprawdzić zdrowie, dietę i ruch konia?"] },
  trener: { title: "Trener", copy: "Treningi, dostępność, podopieczni i komunikacja.", icon: GraduationCap, articles: ["Jak ustawić dostępność treningów?","Jak zaplanować trening podopiecznego?","Jak dodać notatkę po treningu?","Jak śledzić postępy jeźdźca i konia?","Jak zmienić lub odwołać trening?"] },
  "jezdziec-glowny": headRiderHelp,
  "jezdziec-luzak": riderGroomHelp,
  jezdziec: riderGroomHelp,
  luzak: riderGroomHelp,
} as const;

export function generateStaticParams(){return Object.keys(helpCategories).map(category=>({category}))}

export default async function HelpCategoryPage({params}:{params:Promise<{category:string}>}){
  const {category}=await params;
  const data=helpCategories[category as keyof typeof helpCategories];
  if(!data)notFound();
  const Icon=data.icon;
  return <main className="help-page help-category-page"><SubpageHeader/><section className="help-category-shell">
    <a className="help-category-back" href="/pomoc"><ArrowLeft/>Wróć do Pomocy</a>
    <header className="help-category-hero"><i><Icon/></i><div><small>STABLE360 POMOC</small><h1>{data.title}</h1><p>{data.copy}</p></div></header>
    <div className="help-category-heading"><div><small>PORADNIKI DLA CIEBIE</small><h2>Wybierz temat</h2></div><span>{data.articles.length} artykułów</span></div>
    <section className="help-category-articles">{data.articles.map((title,index)=><a href={title==="Jak edytować kartę konia jako właściciel?"?"/pomoc/wlasciciel/jak-edytowac-karte-konia":"/pomoc#kontakt"} key={title}><i>{String(index+1).padStart(2,"0")}</i><span><b>{title}</b><small>Przewodnik Stable360 · {index===0&&category==="wlasciciel"?"4":"3"} min czytania</small></span><ArrowRight/></a>)}</section>
  </section></main>;
}
