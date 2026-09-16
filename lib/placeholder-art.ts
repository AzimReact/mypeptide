// Generates an original, abstract editorial "specimen card" SVG used as
// placeholder product photography for the demo catalog. No external images
// or third-party artwork are used anywhere in this project.

const BG_PALETTES: Array<[string, string]> = [
  ["#f2efe5", "#e6e0cd"],
  ["#f0ece0", "#ddd4b8"],
  ["#efe9dc", "#e2d6b8"],
  ["#eee7d8", "#d9cba0"],
];

export function generateProductArtSvg({
  code,
  seed,
  fillLevel = 0.55,
}: {
  code: string;
  seed: number;
  fillLevel?: number;
}): string {
  const [bgFrom, bgTo] = BG_PALETTES[seed % BG_PALETTES.length];
  const ink = "#17160f";
  const accent = "#a8642c";
  const fillY = -150 + (1 - fillLevel) * 260;

  const dots: string[] = [];
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      dots.push(
        `<circle cx="${90 + col * 130}" cy="${90 + row * 130}" r="1.6" fill="${ink}" opacity="0.06" />`
      );
    }
  }

  return `<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bgFrom}" />
      <stop offset="100%" stop-color="${bgTo}" />
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#bg)" />
  ${dots.join("\n  ")}
  <g transform="translate(400,470)" fill="none" stroke="${ink}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M -30 -195 L -30 -222 L 30 -222 L 30 -195" />
    <rect x="-52" y="-195" width="104" height="300" rx="16" fill="#faf8f2" />
    <line x1="-52" y1="${fillY}" x2="52" y2="${fillY}" stroke="${accent}" stroke-width="2" stroke-dasharray="1 6" />
    <rect x="-52" y="${fillY}" width="104" height="${105 - fillY}" rx="0" fill="${accent}" opacity="0.08" stroke="none" />
    <line x1="-30" y1="-222" x2="-30" y2="-195" />
    <line x1="30" y1="-222" x2="30" y2="-195" />
  </g>
  <text x="400" y="845" text-anchor="middle" font-family="'IBM Plex Mono', ui-monospace, monospace" font-size="22" letter-spacing="6" fill="${ink}" opacity="0.5">${code}</text>
  <text x="400" y="878" text-anchor="middle" font-family="ui-sans-serif, sans-serif" font-size="11" letter-spacing="4" fill="${ink}" opacity="0.32">AXIOM RESEARCH</text>
</svg>`;
}
