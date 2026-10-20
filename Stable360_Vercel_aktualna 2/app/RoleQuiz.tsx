"use client";

import { ArrowLeft, ArrowRight, Check, CircleHelp, Layers, RotateCcw, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { roleProfiles, type RoleSlug } from "./role-data";
import { getRoleRecommendations, questions, roleOrder, toggleAnswer } from "./role-quiz-model";

export default function RoleQuiz() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[][]>([]);
  const [selectedRoles, setSelectedRoles] = useState<RoleSlug[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const hintId = useId();
  const finished = step === questions.length;
  const question = questions[step];
  const selected = answers[step] ?? [];
  const recommendation = getRoleRecommendations(answers);

  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    element.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    title.current?.focus({ preventScroll: true });
    dialog.current?.querySelector(".quiz-modal")?.scrollTo({ top: 0 });
  }, [step, open]);

  const next = () => {
    if (!selected.length) return;
    if (step === questions.length - 1) setSelectedRoles(getRoleRecommendations(answers).roles);
    setStep(value => value + 1);
  };
  const choose = (index: number) => setAnswers(previous => {
    const updated = [...previous];
    updated[step] = toggleAnswer(previous[step] ?? [], index, questions[step]);
    return updated;
  });
  const reset = () => { setAnswers([]); setSelectedRoles([]); setStep(0); };
  const close = () => setOpen(false);
  const toggleRole = (role: RoleSlug) => setSelectedRoles(previous => previous.includes(role)
    ? previous.filter(value => value !== role) : [...previous, role]);

  return <>
    <div className="role-quiz">
      <CircleHelp aria-hidden="true" />
      <span><strong>Które role pasują do Ciebie?</strong><small>10 pytań o obowiązki.<br />Wynik z uzasadnieniem i zestawem ról.</small></span>
      <button ref={trigger} onClick={() => setOpen(true)}>{finished ? "Zobacz swój wynik" : "Zrób test"}<ArrowRight aria-hidden="true" /></button>
    </div>
    <dialog ref={dialog} className="quiz-dialog" aria-labelledby={titleId} onCancel={close} onClose={close}>
      <div className="quiz-modal">
        <button className="quiz-close" onClick={close} aria-label="Zamknij test"><X aria-hidden="true" /></button>
        {!finished ? <form onSubmit={event => { event.preventDefault(); next(); }}>
          <div className="quiz-progress"><span>Test doboru roli · około 3 min</span><strong>{step + 1} / {questions.length}</strong><i aria-hidden="true"><b style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></i></div>
          <h2 id={titleId} ref={title} tabIndex={-1}>{question.title}</h2>
          <p id={hintId} className="quiz-hint">{question.hint}</p>
          <fieldset className="quiz-options" aria-describedby={hintId}>
            <legend className="quiz-sr-only">{question.multi ? "Wybierz wszystkie pasujące odpowiedzi" : "Wybierz jedną odpowiedź"}</legend>
            {question.options.map((option, i) => <label className={selected.includes(i) ? "selected" : ""} key={option.label}>
              <input type={question.multi ? "checkbox" : "radio"} name={`question-${step}`} checked={selected.includes(i)} onChange={() => choose(i)} />
              <span><strong>{option.label}</strong>{option.detail && <small>{option.detail}</small>}</span>
            </label>)}
          </fieldset>
          <div className="quiz-actions">
            <button type="button" onClick={() => setStep(value => value - 1)} disabled={step === 0}><ArrowLeft aria-hidden="true" />Wstecz</button>
            <button type="submit" className="quiz-next" disabled={!selected.length}>{step === questions.length - 1 ? "Zobacz wynik" : "Dalej"}<ArrowRight aria-hidden="true" /></button>
          </div>
          <p className="quiz-footnote">Możesz wrócić do odpowiedzi. Test nie zmienia uprawnień Twojego konta.</p>
        </form> : <div className="quiz-result">
          <small>{recommendation.roles.length ? "Twój zestaw ról" : "Doprecyzuj swój zakres obowiązków"}</small>
          <h2 id={titleId} ref={title} tabIndex={-1}>{selectedRoles.length ? selectedRoles.map(role => roleProfiles[role].title).join(" + ") : "Wybierz role dla siebie"}</h2>
          <p>{recommendation.roles.length
            ? "Na podstawie Twoich odpowiedzi wskazaliśmy główną rolę i dodatkowe obszary pracy. Możesz je łączyć na jednym koncie."
            : "Odpowiedzi nie wskazują jeszcze wyraźnego zakresu obowiązków. Sprawdź je ponownie lub dobierz role poniżej, czytając ich opisy."}</p>
          <div className="quiz-matches">
            {selectedRoles.map(role => {
              const profile = roleProfiles[role];
              const recommended = recommendation.roles.includes(role);
              return <article key={role}>
                <small>{recommended ? role === recommendation.primary ? "Główna rekomendacja" : "Rola uzupełniająca" : "Dodano ręcznie"}</small>
                <h3>{profile.title}</h3><p>{profile.summary}</p>
                <h4>{recommended ? "Dlaczego ta rola?" : "Zakres tej roli"}</h4>
                <ul>{(recommended ? recommendation.reasons[role].slice(0, 3) : profile.tasks.slice(0, 3)).map(reason => <li key={reason}><Check aria-hidden="true" /><span>{reason}</span></li>)}</ul>
                <p className="quiz-role-difference">{profile.difference}</p>
                <a href={`/role/${role}`} onClick={close}>Poznaj rolę<ArrowRight aria-hidden="true" /></a>
              </article>;
            })}
          </div>
          <details className="quiz-customize">
            <summary><Layers aria-hidden="true" />Dostosuj zestaw ról</summary>
            <p>Masz dodatkowe obowiązki? Zaznacz odpowiednie role lub usuń te, których nie potrzebujesz. Role dodane ręcznie oznaczymy w wyniku.</p>
            <div>{roleOrder.map(role => <label key={role}><input type="checkbox" checked={selectedRoles.includes(role)} onChange={() => toggleRole(role)} /><span><strong>{roleProfiles[role].title}</strong><small>{roleProfiles[role].focus}</small></span></label>)}</div>
          </details>
          <div className="quiz-combination-note"><Layers aria-hidden="true" /><p><strong>Jedno konto, kilka zakresów pracy.</strong> Właściciel może być jednocześnie jeźdźcem, a manager także trenerem i jeźdźcem głównym. Dostęp do danych oraz funkcji zależy od ról i uprawnień przyznanych w danej stajni.</p></div>
          <details className="quiz-answer-summary"><summary>Sprawdź i zmień swoje odpowiedzi</summary>{questions.map((item, index) => <div key={item.title}><strong>{index + 1}. {item.title}</strong><p>{(answers[index] ?? []).map(i => item.options[i].label).join("; ")}</p><button onClick={() => setStep(index)}>Zmień odpowiedź<ArrowRight aria-hidden="true" /></button></div>)}</details>
          <a href="/role" onClick={close}>Porównaj wszystkie role<ArrowRight aria-hidden="true" /></a>
          <button onClick={reset}><RotateCcw aria-hidden="true" />Zrób test ponownie</button>
        </div>}
      </div>
    </dialog>
  </>;
}
