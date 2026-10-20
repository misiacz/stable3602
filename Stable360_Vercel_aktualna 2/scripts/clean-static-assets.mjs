import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
const generatedRoutes = ["index", "404", "role", "onas", "wdrozenie", "cennik", "pomoc", ...["manager","owner","trainer","head-rider","rider","groom"].map(s => "role/" + s), ...["pierwsze-kroki","manager","wlasciciel","trener","jezdziec-glowny","jezdziec-luzak","jezdziec","luzak"].map(s => "pomoc/" + s), "pomoc/wlasciciel/jak-edytowac-karte-konia"];
for (const route of generatedRoutes) {
  for (const extension of [".html", ".txt"]) {
    const file = join(process.cwd(), "public", route + extension);
    if (existsSync(file)) rmSync(file);
  }
}
rmSync(join(process.cwd(), "public", "_next"), {recursive: true, force: true});
