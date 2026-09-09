export function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function estimateTextWidth(text, fontSize) {
  let units = 0;
  for (const character of text) {
    if (character === ' ') units += 0.32;
    else if ('ilI.,:;!|'.includes(character)) units += 0.3;
    else if ('MW@#%&'.includes(character)) units += 0.9;
    else units += 0.58;
  }
  return units * fontSize;
}

function splitLongWord(word, maxWidth, fontSize) {
  const parts = [];
  let part = '';
  for (const character of word) {
    if (part && estimateTextWidth(part + character, fontSize) > maxWidth) {
      parts.push(part);
      part = character;
    } else {
      part += character;
    }
  }
  if (part) parts.push(part);
  return parts;
}

export function wrapText(value, maxWidth, fontSize) {
  const lines = [];
  for (const paragraph of String(value).split('\n')) {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push('');
      continue;
    }
    let line = '';
    for (const word of words) {
      const pieces = estimateTextWidth(word, fontSize) > maxWidth
        ? splitLongWord(word, maxWidth, fontSize)
        : [word];
      for (const piece of pieces) {
        const candidate = line ? `${line} ${piece}` : piece;
        if (line && estimateTextWidth(candidate, fontSize) > maxWidth) {
          lines.push(line);
          line = piece;
        } else {
          line = candidate;
        }
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

export function renderTextLines({
  lines,
  x,
  firstBaseline,
  lineHeight,
  fontFamily,
  fontSize,
  fill,
  anchor = 'middle',
  weight = 500,
  className,
}) {
  const classAttribute = className ? ` class="${escapeXml(className)}"` : '';
  const spans = lines.map((line, index) => (
    `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`
  )).join('');
  return `<text${classAttribute} x="${x}" y="${firstBaseline}" fill="${escapeXml(fill)}" font-family="${escapeXml(fontFamily)}" font-size="${fontSize}" font-weight="${weight}" text-anchor="${anchor}">${spans}</text>`;
}
