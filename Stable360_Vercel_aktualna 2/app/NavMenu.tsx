"use client";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Crown, Menu, PersonStanding, TrendingUp, UserRound, Users, Wrench, X } from "lucide-react";

const items = [["wdrozenie","Jak wdrożyć?","/wdrozenie"],["onas","O nas","/onas"]] as const;
const roles = [[Crown,"Manager stajni","/role/manager"],[UserRound,"Właściciel","/role/owner"],[TrendingUp,"Trener","/role/trainer"],[Users,"Jeździec główny","/role/head-rider"],[PersonStanding,"Jeździec","/role/rider"],[Wrench,"Luzak","/role/groom"]] as const;

export default function NavMenu(){
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rolesOpen, setRolesOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const rolesTrigger = useRef<HTMLButtonElement>(null);
  const navigationId = useId();
  const rolesId = useId();

  function close() {
    setMobileOpen(false);
    setRolesOpen(false);
  }

  useEffect(() => {
    if (!mobileOpen && !rolesOpen) return;
    const outside = (event: PointerEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) {
        setMobileOpen(false);
        setRolesOpen(false);
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (rolesOpen) {
        setRolesOpen(false);
        rolesTrigger.current?.focus();
      } else {
        setMobileOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [mobileOpen, rolesOpen]);

  return <div className={`site-navigation${mobileOpen ? " is-open" : ""}`} ref={root}>
    <button ref={trigger} type="button" className="mobile-menu-toggle" aria-label={mobileOpen ? "Zamknij menu" : "Otwórz menu"} aria-expanded={mobileOpen} aria-controls={navigationId} onClick={() => {
      setMobileOpen(value => !value);
      setRolesOpen(false);
    }}>{mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
    <nav id={navigationId} aria-label="Główna nawigacja">
      <a className={pathname === "/" ? "active" : ""} href="/" onClick={close} aria-current={pathname === "/" ? "page" : undefined}>Home</a>
      <div className="nav-role-menu">
        <button ref={rolesTrigger} type="button" className={rolesOpen || pathname.startsWith("/role") ? "active" : ""} onClick={() => setRolesOpen(value => !value)} aria-expanded={rolesOpen} aria-controls={rolesId}>Role<ChevronDown aria-hidden="true" /></button>
        {rolesOpen && <div id={rolesId} className="role-dropdown">{roles.map(([Icon, label, href]) => <a href={href} key={href} onClick={close} aria-current={pathname === href ? "page" : undefined}><i><Icon aria-hidden="true" /></i><span>{label}</span></a>)}</div>}
      </div>
      {items.map(([key, label, href]) => <a className={pathname === href ? "active" : ""} href={href} key={key} onClick={close} aria-current={pathname === href ? "page" : undefined}>{label}</a>)}
    </nav>
  </div>;
}
