import { ArrowRight, CheckSquare, Heart, TrendingUp, Users } from "lucide-react";
import AboutTeam from "../AboutTeam";
import SubpageHeader from "../SubpageHeader";

export default function AboutPage(){return <main className="about-page">
 <SubpageHeader/>
 <section className="about-hero"><img src="/about-team-hero.jpg" alt="Zespół Stable360 z koniem przed stajnią"/><div><p>O nas</p><h1>Ze stajni.<br/>Dla stajni.</h1><span>Stable360 powstało z codzienności stajni sportowych. Tworzymy produkt, który naprawdę ułatwia pracę i życie w stajni.</span><a href="#zespol">Poznaj nasz zespół <ArrowRight/></a></div></section>
 <section className="about-people" id="zespol"><div className="about-heading team-heading"><small>Zespół</small><h2>Poznaj nasz zespół.</h2><span>Różne doświadczenia, jeden cel — tworzymy najlepsze narzędzie dla stajni.</span></div><AboutTeam/></section>
 <section className="about-values"><article><CheckSquare/><h3>Z realnych problemów</h3><p>Znamy stajnię od środka i wiemy, czego potrzebuje na co dzień.</p></article><article><Users/><h3>Dla stajni sportowych</h3><p>Tworzymy system dopasowany do rytmu i potrzeb stajni.</p></article><article><Heart/><h3>Razem ze stajniami</h3><p>Wasze uwagi realnie wpływają na rozwój produktu.</p></article><article><TrendingUp/><h3>Z myślą o przyszłości</h3><p>Budujemy technologię, która rośnie razem z Wami.</p></article></section>
 <section className="about-feedback"><img src="/onboarding-horse.jpg" alt="Koń w stajni"/><div><h2>Tworzymy Stable360<br/>razem ze stajniami.</h2><p>Wasze uwagi nadal wpływają na to, co budujemy. Powiedz nam, co możemy zrobić lepiej.</p><a href="mailto:kontakt@stable360.pl">Napisz nam swoją uwagę <ArrowRight/></a></div></section>
</main>}
