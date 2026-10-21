"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle2, CloudUpload, Flag, House, Mail, Search, ShieldCheck, SlidersHorizontal, UserPlus, UserRound } from "lucide-react";

const paths = {
  join: { tab:"Dołączam do istniejącej stajni", title:"Dołączam do istniejącej stajni", subtitle:"Szybko dołącz i zacznij działać.", steps:[[UserRound,"Załóż konto","Utwórz konto w Stable360 w kilka sekund."],[Search,"Znajdź swoją stajnię","Wyszukaj stajnię po nazwie."],[Mail,"Otrzymaj zaproszenie","Poproś managera o kod lub zaproszenie."],[CheckCircle2,"Dołącz do stajni","Wpisz kod lub zaakceptuj zaproszenie."],[SlidersHorizontal,"Skonfiguruj konto","Wybierz rolę i ustaw preferencje."],[Flag,"Gotowe!","Masz dostęp i możesz zacząć działać."]]},
  create: { tab:"Zakładam lub przenoszę stajnię", title:"Zakładam lub przenoszę stajnię", subtitle:"Zacznij od zera lub przenieś dane — pomożemy.", steps:[[House,"Załóż stajnię","Utwórz stajnię i zostań jej administratorem."],[SlidersHorizontal,"Skonfiguruj stajnię","Wstaw informacje, preferencje i ustawienia."],[CloudUpload,"Dodaj lub importuj dane","Dodaj konie i użytkowników ręcznie lub z pliku."],[UserPlus,"Zaproś zespół","Zaproś jeźdźców, trenerów i pracowników."],[ShieldCheck,"Ustaw role","Nadaj właściwe role i uprawnienia."],[Flag,"Zacznij działać","Twój zespół ma dostęp, a Ty pełną kontrolę."]]}
} as const;

export default function ProcessDetails(){
  const [active,setActive]=useState<keyof typeof paths>("join"); const path=paths[active];
  return <div className="process-details is-open">
    <div className="process-panel"><div className="process-tabs" role="tablist" aria-label="Wybierz sposób wdrożenia">{(Object.keys(paths) as (keyof typeof paths)[]).map(key=><button key={key} type="button" role="tab" aria-selected={active===key} className={active===key?"active":""} onClick={()=>setActive(key)}>{key==="join"?<UserPlus/>:<House/>}<span>{paths[key].tab}</span></button>)}</div>
      <div className="process-diagram" role="tabpanel" key={active}><header><i>{active==="join"?<UserPlus/>:<House/>}</i><span><strong>{path.title}</strong><small>{path.subtitle}</small></span></header><div className="process-steps">{path.steps.map(([Icon,title,text],index)=><div className="process-step" key={title}><b>{index+1}</b><i><Icon/></i><strong>{title}</strong><p>{text}</p>{index<path.steps.length-1&&<ArrowRight className="step-arrow"/>}</div>)}</div></div>
    </div>
  </div>;
}
