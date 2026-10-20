import { ArrowRight, Headphones } from "lucide-react";
import ProcessDetails from "../ProcessDetails";
import SubpageHeader from "../SubpageHeader";

export default function OnboardingPage(){return <main className="onboarding-page">
  <SubpageHeader/>
  <section className="onboarding-hero"><p>Jak wdrożyć Stable360</p><h1>Proste wdrożenie.<br/><span>Szybkie efekty.</span></h1><div>Wybierz opcję, która najlepiej opisuje Twoją sytuację.<br/>Zobaczysz tylko właściwą dla Ciebie ścieżkę.</div></section>
  <section className="onboarding-diagrams"><ProcessDetails/></section>
  <section className="onboarding-help"><Headphones/><div><h2>Nie zostajesz sam.</h2><p>Jesteśmy z Tobą na każdym etapie wdrożenia — od pierwszego logowania po codzienne użytkowanie.</p></div><a href="/#kontakt">Umów prezentację<ArrowRight/></a></section>
</main>}
