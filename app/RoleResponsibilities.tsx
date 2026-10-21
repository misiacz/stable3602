import { Check, Layers } from "lucide-react";
import { roleProfiles, type RoleSlug } from "./role-data";

export default function RoleResponsibilities({ role }: { role: RoleSlug }) {
  const profile = roleProfiles[role];
  return <section className="role-responsibilities" aria-label={`Obowiązki i zakres roli: ${profile.title}`}>
    <div><small>Za co odpowiadasz</small><h2>{profile.focus}</h2><ul>{profile.tasks.map(task => <li key={task}><Check aria-hidden="true" />{task}</li>)}</ul></div>
    <aside><Layers aria-hidden="true" /><h3>Co wyróżnia tę rolę?</h3><p>{profile.difference}</p><h3>W praktyce</h3><p>{profile.example}</p><p>Łączysz kilka obowiązków? Możesz korzystać z kilku ról na jednym koncie, zgodnie z uprawnieniami przyznanymi w danej stajni.</p><a href="/role#test-roli">Dobierz swój zestaw ról →</a></aside>
  </section>;
}
