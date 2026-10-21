import { ArrowLeft, ArrowRight, Check, Clock3, HeartPulse, Lightbulb, Pencil, ShieldCheck, UserRound } from "lucide-react";
import SubpageHeader from "../../../SubpageHeader";

export const metadata = {
  title: "Jak edytować kartę konia jako właściciel? — Stable360 Pomoc",
  description: "Instrukcja krok po kroku: jak otworzyć kartę przypisanego konia i zaktualizować jego dane w Stable360.",
};

const sections = [
  ["krok-1", "Wejdź w zakładkę Konie"],
  ["krok-2", "Wybierz konia z listy"],
  ["krok-3", "Otwórz kartę konia"],
  ["krok-4", "Włącz tryb edycji"],
  ["krok-5", "Uzupełnij dane"],
] as const;

export default function EditHorseCardArticle(){
  return <main className="help-page help-article-page">
    <SubpageHeader />
    <article className="help-article-shell">
      <a className="help-category-back" href="/pomoc/wlasciciel"><ArrowLeft/>Wróć do poradników właściciela</a>

      <header className="help-article-hero">
        <div className="help-article-kicker"><i><UserRound/></i><span>WŁAŚCICIEL · KARTA KONIA</span></div>
        <h1>Jak edytować kartę konia jako właściciel?</h1>
        <p>Przejdź od listy koni do właściwej karty, uruchom tryb edycji i zaktualizuj potrzebne informacje — spokojnie, krok po kroku.</p>
        <div className="help-article-meta"><span><Clock3/>4 min czytania</span><span><Check/>5 prostych kroków</span><span><ShieldCheck/>Zanonimizowane przykłady</span></div>
      </header>

      <div className="help-article-layout">
        <aside className="help-article-toc">
          <small>W TYM ARTYKULE</small>
          <nav>{sections.map(([id,title],index)=><a href={`#${id}`} key={id}><i>{index+1}</i><span>{title}</span></a>)}</nav>
          <a className="help-article-support" href="/pomoc#kontakt"><Lightbulb/><span><b>Potrzebujesz pomocy?</b><small>Napisz do zespołu Stable360</small></span><ArrowRight/></a>
        </aside>

        <div className="help-article-content">
          <section className="help-article-before">
            <i><HeartPulse/></i><div><b>Zanim zaczniesz</b><p>Zaloguj się na konto właściciela i upewnij się, że koń jest przypisany do Twojego profilu. Dzięki temu zobaczysz go na liście w aplikacji.</p></div>
          </section>

          <section className="help-article-step" id="krok-1">
            <header><i>01</i><div><small>NAWIGACJA</small><h2>Wejdź w zakładkę „Konie”</h2></div></header>
            <p>Po zalogowaniu wybierz <strong>Konie</strong> na dolnym pasku nawigacji. To tutaj znajdziesz wszystkie konie przypisane do Twojego konta.</p>
            <figure className="help-article-shot nav-shot"><img src="/help/owner-horse-card/navigation.jpg" alt="Pasek nawigacji Stable360 z zakładką Konie"/><figcaption>Zakładka „Konie” znajduje się na głównym pasku aplikacji.</figcaption></figure>
          </section>

          <section className="help-article-step" id="krok-2">
            <header><i>02</i><div><small>LISTA KONI</small><h2>Wybierz konia, którego dane chcesz zmienić</h2></div></header>
            <p>Na liście zobaczysz konie udostępnione na Twoim koncie. Kliknij właściwy kafelek, aby przejść do szczegółów wybranego konia.</p>
            <figure className="help-article-shot"><img src="/help/owner-horse-card/horse-list.jpg" alt="Lista koni przypisanych do konta właściciela"/><figcaption>Kliknięcie kafelka otwiera kartę wybranego konia.</figcaption></figure>
          </section>

          <section className="help-article-step" id="krok-3">
            <header><i>03</i><div><small>KARTA KONIA</small><h2>Otwórz odpowiednią zakładkę</h2></div></header>
            <p>W karcie konia informacje są uporządkowane tematycznie. Możesz przełączać się między zakładkami bez wychodzenia z widoku konia.</p>
            <div className="help-article-chips">{["Ogólne","Zdrowie","Dieta","Ruch","Wyposażenie","Trening","Dokumenty","Historia","Kontakty","Uwagi"].map(label=><span key={label}>{label}</span>)}</div>
            <figure className="help-article-shot wide-shot"><img src="/help/owner-horse-card/horse-card.png" alt="Karta konia z zakładkami i danymi ogólnymi"/><figcaption>Wybierz zakładkę odpowiadającą informacjom, które chcesz sprawdzić lub uzupełnić.</figcaption></figure>
          </section>

          <section className="help-article-step help-article-edit-step" id="krok-4">
            <header><i>04</i><div><small>TRYB EDYCJI</small><h2>Kliknij „Edytuj”</h2></div></header>
            <div className="help-article-edit-grid"><div><p>Przycisk znajdziesz w prawym górnym rogu karty. Po jego wybraniu pola, do których masz dostęp, staną się edytowalne.</p><div className="help-article-tip"><Lightbulb/><span><b>Nie widzisz przycisku?</b><small>Sprawdź, czy korzystasz z właściwej roli i czy koń jest przypisany do Twojego konta.</small></span></div></div><figure><img src="/help/owner-horse-card/edit-button.jpg" alt="Przycisk Edytuj w karcie konia"/></figure></div>
          </section>

          <section className="help-article-step" id="krok-5">
            <header><i>05</i><div><small>AKTUALIZACJA DANYCH</small><h2>Uzupełnij lub popraw informacje</h2></div></header>
            <p>W trybie edycji możesz zmieniać dane w kolejnych zakładkach karty. W zależności od pola wpiszesz tekst, wybierzesz wartość z listy albo wskażesz datę.</p>
            <div className="help-article-checklist">
              <div><Check/><span><b>Sprawdź właściwego konia</b><small>Przed zmianą danych upewnij się, że otwarta jest właściwa karta.</small></span></div>
              <div><Check/><span><b>Przejdź przez potrzebne zakładki</b><small>Nie musisz uzupełniać wszystkiego naraz — skup się na aktualizowanej informacji.</small></span></div>
              <div><Check/><span><b>Zakończ tryb edycji</b><small>Po wprowadzeniu zmian zamknij edycję przyciskiem widocznym w prawym górnym rogu.</small></span></div>
            </div>
          </section>

          <section className="help-article-privacy"><ShieldCheck/><div><b>Twoje dane są ważne</b><p>Zrzuty w tym poradniku zostały zanonimizowane. Nie pokazują danych prawdziwego użytkownika ani konia.</p></div></section>

          <footer className="help-article-footer"><div><small>GOTOWE</small><b>Karta konia może być teraz na bieżąco aktualizowana.</b></div><a href="/pomoc/wlasciciel">Zobacz pozostałe poradniki właściciela <ArrowRight/></a></footer>
        </div>
      </div>
    </article>
  </main>;
}
