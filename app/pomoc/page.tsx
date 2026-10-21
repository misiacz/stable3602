import SubpageHeader from "../SubpageHeader";
import HelpCenter from "./HelpCenter";

export const metadata = {
  title: "Pomoc — Stable360",
  description: "Instrukcje, odpowiedzi i porady dla użytkowników Stable360.",
};

export default function HelpPage(){
  return <main className="help-page">
    <SubpageHeader />
    <HelpCenter />
  </main>;
}
