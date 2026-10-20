import { ArrowRight } from "lucide-react";
import NavMenu from "./NavMenu";

export default function SubpageHeader(){
  return <header className="role-detail-nav global-subpage-nav"><a className="brand" href="/" aria-label="Stable360 — strona główna"><img src="/stable360-logo-exact.png" alt="Stable360"/></a><NavMenu/><a className="role-black-cta" href="https://tally.so/r/Z95YEo"><span>Wypróbuj<span className="desktop-cta-suffix"> Stable360</span></span><ArrowRight aria-hidden="true"/></a></header>;
}
