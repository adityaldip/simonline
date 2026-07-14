import { describe, expect, it } from 'vitest';
import { generateOrganizationCode } from './org-code';

describe('generateOrganizationCode', () => {
  it('uses type prefix and name hint', () => {
    const code = generateOrganizationCode('POLRES', 'Polres Kota Semarang');
    expect(code.startsWith('POLRES-')).toBe(true);
    expect(code.length).toBeGreaterThanOrEqual(8);
  });

  it('generates random suffix when name is empty', () => {
    const code = generateOrganizationCode('POLDA');
    expect(code).toMatch(/^POLDA-[A-Z0-9]{4}$/);
  });
});
