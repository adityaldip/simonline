const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomSuffix(length = 4): string {
  return Array.from(
    { length },
    () => CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)],
  ).join('');
}

/** Generates a unique-style org code, optionally derived from name + type prefix. */
export function generateOrganizationCode(
  type: 'POLDA' | 'POLRES' | 'POLSEK',
  name?: string,
): string {
  const trimmed = name?.trim();
  if (trimmed) {
    const words = trimmed.split(/\s+/).filter((w) => w.length > 0);
    const acronym = words
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 4);
    const lastWord = words[words.length - 1]?.replace(/[^a-zA-Z]/g, '').toUpperCase() ?? '';
    const fromName =
      lastWord.length >= 3 ? lastWord.slice(0, 4) : acronym.length >= 2 ? acronym : '';
    if (fromName) {
      return `${type}-${fromName}`;
    }
  }
  return `${type}-${randomSuffix()}`;
}
