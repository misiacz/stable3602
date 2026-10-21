import { Heart, Headphones, RefreshCw, ShieldCheck } from "lucide-react";
import PricingConfigurator from "../PricingConfigurator";
import SubpageHeader from "../SubpageHeader";

export default function PricingPage(){return <main className="pricing-page">
  <SubpageHeader/>
  <section className="pricing-hero"><p>Kalkulator cennika</p><h1>Policz miesięczny koszt<span>.</span></h1><div>Zaznacz role, podaj liczbę koni i sprawdź orientacyjną wycenę. Bez zakupu i bez uruchamiania płatności.</div></section>
  <PricingConfigurator/>
  <section className="pricing-trust"><div><ShieldCheck/><strong>Bezpieczne dane</strong><small>Twoje dane są w dobrych rękach.</small></div><div><RefreshCw/><strong>Zawsze aktualne</strong><small>Nowe funkcje i usprawnienia.</small></div><div><Headphones/><strong>Wsparcie</strong><small>Jesteśmy tu, kiedy nas potrzebujesz.</small></div><div><Heart/><strong>Tworzone z pasją</strong><small>Razem ze stajniami.</small></div></section>
</main>}
