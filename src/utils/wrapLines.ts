const BLOCK_PREFIX =
  /^\s*(?:>\s?)*(?:(?:[-*+]|\d+[.)])\s+(?:\[.\]\s+)?|#{1,6}\s+)?/;
const FENCE = /^\s*(?:>\s?)*(?:```|~~~)/;
const HORIZONTAL_RULE = /^\s*([-*_])(?:\s*\1){2,}\s*$/;

export function hasBlockPrefix(line: string) {
  return BLOCK_PREFIX.exec(line)[0].trim().length > 0;
}

// An inline tag cannot span block boundaries, so every line gets its own pair,
// placed behind list/quote/heading markers to keep them at the line start.
export function wrapLines(
  text: string,
  prefix: string,
  suffix: string,
  startsAtLineStart: boolean
) {
  let inFence = false;

  return text
    .split("\n")
    .map((line, index) => {
      if (FENCE.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence || HORIZONTAL_RULE.test(line)) return line;

      const marker =
        index > 0 || startsAtLineStart ? BLOCK_PREFIX.exec(line)[0] : "";
      const content = line.slice(marker.length);
      if (!content.trim()) return line;

      return `${marker}${prefix}${content}${suffix}`;
    })
    .join("\n");
}
