"use client";

import { useState } from "react";
import { CalendarDays, Check, ClipboardCheck } from "lucide-react";
import { ChecklistsApp, HorsesReadyApp, OwnerScheduleApp } from "./OwnerHorseShowcase";

const groomModules = [
  {id:"schedule",title:"Grafik koni",copy:"Podgląd planu ustawionego przez jeźdźca głównego.",icon:CalendarDays},
  {id:"checklists",title:"Checklisty",copy:"Listy zadań do wykonania w stajni.",icon:ClipboardCheck},
  {id:"horses",title:"Lista koni",copy:"Konie gotowe i wymagające przygotowania.",icon:Check},
] as const;

export default function GroomShowcase(){
  const [active,setActive]=useState<(typeof groomModules)[number]["id"]>("schedule"); const selected=groomModules.find(item=>item.id===active)!; const Icon=selected.icon;
  return <div className="owner-horse-showcase owner-modules-showcase groom-modules-showcase"><aside className="owner-module-tabs">{groomModules.map(item=>{const ItemIcon=item.icon;return <button className={active===item.id?"active":""} onClick={()=>setActive(item.id)} key={item.id}><ItemIcon/><span><b>{item.title}</b><small>{item.copy}</small></span></button>})}</aside><div className="owner-phone-wrap"><div className="owner-phone-label"><Icon/><span><small>INTERAKTYWNY MOCKUP LUZAKA</small><b>{selected.title}</b></span></div><div className="mockup-phone"><div className="mockup-phone-notch"/>{active==="schedule"?<OwnerScheduleApp/>:active==="checklists"?<ChecklistsApp/>:<HorsesReadyApp/>}</div></div></div>
}
