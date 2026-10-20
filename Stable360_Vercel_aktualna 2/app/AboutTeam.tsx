"use client";

import { ArrowRight, Mail, Target, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

const team = [
  { name:"Michalina Czyżewicz", initials:"MC", role:"Co-founder", image:"/michalina-czyzewicz.jpg", facePosition:"58% 37%", linkedin:"https://www.linkedin.com/in/michalina-czy%C5%BCewicz-a53694324", lead:"Łączy produkt, technologię i ludzi.", bio:"Przedsiębiorczyni, założycielka startupów technologicznych i prelegentka TEDx z doświadczeniem w tworzeniu strategii biznesowych oraz rozwijaniu nowych produktów. Wyróżnia ją determinacja w realizowaniu pomysłów, w które wierzy.", strengths:[["Product & Strategy","Planowanie produktu, priorytetyzacja i roadmapa."],["User Research","Zrozumienie potrzeb stajni i codziennych wyzwań."],["Business & Growth","Partnerstwa i rozwój Stable360."]] },
  { name:"Gabriela Biedka", initials:"GB", role:"Co-founder", image:"/gabriela-biedka.jpg", facePosition:"68% 35%", instagram:"https://www.instagram.com/gabi.biedka", lead:"Zna stajnię od środka.", bio:"Gabriela Biedka to czynna zawodniczka skoków przez przeszkody z doświadczeniem w startach na poziomie Grand Prix, trzykrotna złota medalistka mistrzostw Polski oraz instruktorka sportu i szkoleniowiec PZJ. Pasjonuje się pracą z młodymi końmi, zawsze stawiając ich dobro na pierwszym miejscu.", strengths:[["Stajnia sportowa","Praktyczna znajomość codziennej pracy."],["Operacje","Procesy i organizacja zespołu."],["Użytkownik","Perspektywa zawodników i stajni."]] },
  { name:"Stanisław Przedpełski", initials:"SP", role:"Co-founder", image:"/stanislaw-przedpelski.jpg", facePosition:"67% 34%", instagram:"https://www.instagram.com/przedpelski_sporthorses/", lead:"Rozumie realia profesjonalnego sportu.", bio:"Stanisław Przedpełski to czynny zawodnik startujący w konkursach Grand Prix, medalista mistrzostw Polski, uczestnik mistrzostw Europy i doświadczony szkoleniowiec PZJ. Organizacja to jego drugie imię — potrafi zadbać o każdy szczegół stajennej codzienności.", strengths:[["Sport wyczynowy","Doświadczenie z aren międzynarodowych."],["Operacje","Realia profesjonalnych stajni."],["Ekspertyza","Perspektywa trenera i zawodnika."]] },
  { name:"Marcin Korona", initials:"MK", role:"Lead Developer", image:"/marcin-korona.jpg", facePosition:"62% 34%", lead:"Pomaga Stable360 rosnąć razem ze stajniami.", bio:"Od ok. 7 lat tworzy aplikacje w React i Next.js. W Stable360 odpowiada za całą technologię: od aplikacji mobilnej po serwer.", strengths:[["Development","Tworzenie nowych funkcji Stable360."],["Jakość","Dbałość o szybkość i niezawodność."],["Rozwój","Stałe ulepszanie doświadczenia użytkownika."]] },
] as const;

const strengthIcons = [Target, Users, TrendingUp];

export default function AboutTeam() {
  const [active, setActive] = useState(0);
  const person = team[active];
  return <div className="team-directory">
    <div className="team-directory-tabs" role="tablist" aria-label="Zespół Stable360">
      {team.map((item,index)=><button type="button" role="tab" aria-selected={active===index} className={active===index?"active":""} onClick={()=>setActive(index)} key={item.name}>
        <i><img src={item.image} alt="" style={{objectPosition:item.facePosition}}/></i>
        <span><strong>{item.name}</strong><small>{item.role}</small></span>
      </button>)}
    </div>
    <article className="team-directory-profile" key={person.name}>
      <div className="team-directory-photo has-photo"><img src={person.image} alt={person.name} style={{objectPosition:person.facePosition}}/></div>
      <div className="team-directory-copy">
        <small>{person.role}</small><h3>{person.name}</h3><h4>{person.lead}</h4><p>{person.bio}</p><hr/><span>Wnosi do Stable360</span>
        <div className="team-directory-strengths">{person.strengths.map(([title,description],index)=>{const Icon=strengthIcons[index];return <div key={title}><i><Icon/></i><span><strong>{title}</strong><small>{description}</small></span></div>})}</div>
        <div className="team-directory-socials">{"linkedin" in person&&<a href={person.linkedin} target="_blank" rel="noreferrer" aria-label={`LinkedIn — ${person.name}`}><b>in</b></a>}{"instagram" in person&&<a href={person.instagram} target="_blank" rel="noreferrer" aria-label={`Instagram — ${person.name}`}><b>IG</b></a>}<a href="mailto:kontakt@stable360.pl" aria-label="Napisz do zespołu Stable360"><Mail/></a></div>
      </div>
    </article>
    <footer className="team-directory-quote"><i>“</i><p>Wierzymy, że najlepsze rozwiązania powstają wtedy, gdy technologia spotyka się z prawdziwymi potrzebami stajni.</p><a href="mailto:kontakt@stable360.pl">Dołącz do nas <ArrowRight/></a></footer>
  </div>;
}
