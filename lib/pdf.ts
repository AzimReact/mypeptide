// Minimal, dependency-free single-page PDF generator used only to produce
// realistic-looking placeholder COA/SDS documents for the demo catalog.
// Not a general-purpose PDF library — one Helvetica page, left-aligned text.

function escapePdfText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

export function createSimplePdf(title: string, lines: string[]): Buffer {
  const fontSize = 11;
  const titleSize = 16;
  const startY = 740;
  const lineHeight = 18;

  const contentLines: string[] = [];
  contentLines.push(`BT /F2 ${titleSize} Tf 72 ${startY} Td (${escapePdfText(title)}) Tj ET`);

  const y = startY - 36;
  contentLines.push(`BT /F1 ${fontSize} Tf 72 ${y} Td`);
  lines.forEach((line, index) => {
    if (index === 0) {
      contentLines.push(`(${escapePdfText(line)}) Tj`);
    } else {
      contentLines.push(`0 -${lineHeight} Td (${escapePdfText(line)}) Tj`);
    }
  });
  contentLines.push("ET");

  const stream = contentLines.join("\n");

  const objects: string[] = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  objects.push(
    "<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /MediaBox [0 0 612 792] /Contents 6 0 R >>"
  );
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  objects.push(`<< /Length ${Buffer.byteLength(stream, "utf-8")} >>\nstream\n${stream}\nendstream`);

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];

  objects.forEach((obj, index) => {
    offsets.push(Buffer.byteLength(pdf, "utf-8"));
    pdf += `${index + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, "utf-8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${offsets[i].toString().padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "utf-8");
}
