import { SYNONYMS } from "./dictionary";

export function normalizeToken(token: string): string {
  const cleaned = token.toLowerCase().trim().replace(/^[^\w+#./]+|[^\w+#./]+$/g, "");
  return SYNONYMS[cleaned] || cleaned;
}

export function extractTokensAndPhrases(text: string): string[] {
  if (!text) return [];

  const lower = text.toLowerCase();
  
  // Extract words and symbols
  const words = lower.split(/[\s,;|/()\-–—]+/).map((w) => normalizeToken(w)).filter(Boolean);
  
  // Also collect 2-word and 3-word n-grams
  const phrases: string[] = [];
  const rawWords = text.toLowerCase().split(/\s+/);
  for (let i = 0; i < rawWords.length; i++) {
    const w1 = normalizeToken(rawWords[i]);
    if (i < rawWords.length - 1) {
      const w2 = normalizeToken(rawWords[i + 1]);
      const bi = `${w1} ${w2}`.trim();
      if (bi) phrases.push(SYNONYMS[bi] || bi);
    }
    if (i < rawWords.length - 2) {
      const w2 = normalizeToken(rawWords[i + 1]);
      const w3 = normalizeToken(rawWords[i + 2]);
      const tri = `${w1} ${w2} ${w3}`.trim();
      if (tri) phrases.push(SYNONYMS[tri] || tri);
    }
  }

  const allTokens = Array.from(new Set([...words, ...phrases]));
  return allTokens;
}
