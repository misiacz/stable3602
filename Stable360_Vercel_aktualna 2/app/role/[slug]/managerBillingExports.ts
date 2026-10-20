export type ExportRow = { name: string; price: number; discount: string; amount: number; description: string };

export function escapeMarkup(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character]!);
}

function join(parts: Uint8Array[]) {
  const output = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let offset = 0;
  for (const part of parts) { output.set(part, offset); offset += part.length; }
  return output;
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function zip(files: Record<string, string>) {
  const encoder = new TextEncoder();
  const entries = Object.entries(files);
  const local: Uint8Array[] = [], central: Uint8Array[] = [];
  let offset = 0;
  for (const [filename, contents] of entries) {
    const name = encoder.encode(filename), bytes = encoder.encode(contents), crc = crc32(bytes);
    const header = new Uint8Array(30), view = new DataView(header.buffer);
    view.setUint32(0, 0x04034b50, true); view.setUint16(4, 20, true); view.setUint16(6, 0x800, true); view.setUint16(12, 33, true);
    view.setUint32(14, crc, true); view.setUint32(18, bytes.length, true); view.setUint32(22, bytes.length, true); view.setUint16(26, name.length, true);
    const directory = new Uint8Array(46), directoryView = new DataView(directory.buffer);
    directoryView.setUint32(0, 0x02014b50, true); directoryView.setUint16(4, 20, true); directoryView.setUint16(6, 20, true); directoryView.setUint16(8, 0x800, true); directoryView.setUint16(14, 33, true);
    directoryView.setUint32(16, crc, true); directoryView.setUint32(20, bytes.length, true); directoryView.setUint32(24, bytes.length, true); directoryView.setUint16(28, name.length, true); directoryView.setUint32(42, offset, true);
    local.push(header, name, bytes); central.push(directory, name); offset += header.length + name.length + bytes.length;
  }
  const directory = join(central), end = new Uint8Array(22), endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true); endView.setUint16(8, entries.length, true); endView.setUint16(10, entries.length, true); endView.setUint32(12, directory.length, true); endView.setUint32(16, offset, true);
  return join([...local, directory, end]);
}

export function createBillingWorkbook(title: string, rows: ExportRow[], total: number, paid: number) {
  const values: (string | number)[][] = [[title], ["Dane demonstracyjne Stable360"], [], ["Pozycja", "Cena (zł)", "Rabat", "Kwota (zł)", "Opis"], ...rows.map((row) => [row.name, row.price / 100, row.discount, row.amount / 100, row.description]), [], ["Suma", "", "", total / 100], ["Zapłacono", "", "", paid / 100], ["Pozostało", "", "", Math.max(0, total - paid) / 100]];
  const sheet = values.map((row, rowIndex) => `<row r="${rowIndex + 1}">${row.map((value, index) => { const address = `${String.fromCharCode(65 + index)}${rowIndex + 1}`; return typeof value === "number" ? `<c r="${address}" s="1"><v>${value.toFixed(2)}</v></c>` : `<c r="${address}" t="inlineStr"><is><t xml:space="preserve">${escapeMarkup(value)}</t></is></c>`; }).join("")}</row>`).join("");
  return zip({
    "[Content_Types].xml": '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>',
    "_rels/.rels": '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
    "xl/workbook.xml": '<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Rozliczenie" sheetId="1" r:id="rId1"/></sheets></workbook>',
    "xl/_rels/workbook.xml.rels": '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>',
    "xl/styles.xml": '<?xml version="1.0" encoding="UTF-8"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="2"><xf fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="4" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>',
    "xl/worksheets/sheet1.xml": `<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols><col min="1" max="1" width="35" customWidth="1"/><col min="2" max="4" width="18" customWidth="1"/><col min="5" max="5" width="55" customWidth="1"/></cols><sheetData>${sheet}</sheetData></worksheet>`,
  });
}

export function createBillingPrintHtml(title: string, rows: ExportRow[], total: number, paid: number) {
  const money = (amount: number) => (amount / 100).toLocaleString("pl-PL", { style: "currency", currency: "PLN" });
  return `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>${escapeMarkup(title)}</title><style>@page{size:A4;margin:20mm}body{font-family:Arial,sans-serif;color:#27231f;font-size:12px}h1{font-size:23px}small{color:#807468}table{width:100%;margin:25px 0;border-collapse:collapse}th,td{padding:11px 7px;border-bottom:1px solid #ddd;text-align:left}th{background:#f6f0e7}td:last-child,th:last-child{text-align:right;white-space:nowrap}.description{display:block;white-space:pre-wrap;font-size:10px;color:#807468}dl{margin-left:auto;width:240px}dl>div{display:flex;justify-content:space-between;padding:7px}dd{margin:0;font-weight:bold}footer{margin-top:35px;color:#807468;font-size:10px}</style></head><body><small>STABLE360 · PODGLĄD DEMONSTRACYJNY</small><h1>${escapeMarkup(title)}</h1><table><thead><tr><th>Pozycja</th><th>Rabat</th><th>Kwota</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${escapeMarkup(row.name)}${row.description ? `<span class="description">${escapeMarkup(row.description)}</span>` : ""}</td><td>${escapeMarkup(row.discount)}</td><td>${money(row.amount)}</td></tr>`).join("")}</tbody></table><dl><div><dt>Suma</dt><dd>${money(total)}</dd></div><div><dt>Zapłacono</dt><dd>${money(paid)}</dd></div><div><dt>Pozostało</dt><dd>${money(Math.max(0, total - paid))}</dd></div></dl><footer>Dane przykładowe. Dokument nie jest fakturą.</footer></body></html>`;
}
