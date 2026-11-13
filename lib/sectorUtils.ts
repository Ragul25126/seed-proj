export const SECTORS = [
  'All Sectors',
  'Hospitality',
  'Residential',
  'Commercial',
  'Education',
  'Healthcare',
  'Retail',
  'Sports & Stadiums',
  'Entertainment & Culture',
  'Aviation',
  'Villas & Private Estates',
  'Infrastructure & Sustainable Communities',
] as const;

export type SectorType = (typeof SECTORS)[number];

/**
 * Formats a project sector label, removing excluded sectors (Industrial, Public Buildings, Theme Parks) wherever they appear.
 * If the sector consists solely of excluded terms, returns an empty string.
 * If it's compound (e.g. "Commercial · Theme Parks"), strips the excluded term.
 */
export function formatProjectSector(sector?: string | null): string {
  if (!sector) return '';
  const cleaned = sector
    .split(/[·,\/|]/)
    .map(s => s.trim())
    .filter(s => {
      if (!s) return false;
      const lower = s.toLowerCase();
      if (lower.includes('industr')) return false;
      if (lower.includes('public building') || lower.includes('theme park')) return false;
      return true;
    })
    .join(' · ');
  return cleaned;
}

/**
 * Flexible sector matching across database values, aliases, and URL parameters.
 * Guarantees zero bleed between sectors (e.g., healthcare never matches hospitality).
 */
export function matchSector(projSector: string | null | undefined, targetFilter: string): boolean {
  if (!targetFilter || targetFilter === 'All Sectors') return true;
  if (!projSector) return false;

  const pSec = projSector.trim().toLowerCase();
  const tSec = targetFilter.trim().toLowerCase();

  if (pSec === tSec) return true;

  // Safety fallback: ensure "hospitality" is never matched to "hospital" and vice versa
  if (
    (tSec.includes('hospital') && !tSec.includes('hospitality') && pSec.includes('hospitality')) ||
    (pSec.includes('hospital') && !pSec.includes('hospitality') && tSec.includes('hospitality'))
  ) {
    return false;
  }

  if (tSec.includes('hospitality') || tSec.includes('hotel') || tSec.includes('resort')) {
    return pSec.includes('hospitality') || pSec.includes('hotel') || pSec.includes('resort');
  }
  if (tSec.includes('residential') || tSec.includes('housing') || tSec.includes('apartment')) {
    return pSec.includes('residential') || pSec.includes('apartment') || pSec.includes('housing');
  }
  if (tSec.includes('commercial') || tSec.includes('office') || tSec.includes('headquarters')) {
    return pSec.includes('commercial') || pSec.includes('office') || pSec.includes('headquarters');
  }
  if (tSec.includes('industrial') || tSec.includes('warehouse') || tSec.includes('factory')) {
    return pSec.includes('industr') || pSec.includes('factory') || pSec.includes('warehouse') || pSec.includes('logistics');
  }
  if (tSec.includes('education') || tSec.includes('school') || tSec.includes('university')) {
    return pSec.includes('education') || pSec.includes('school') || pSec.includes('university');
  }
  if (tSec.includes('healthcare') || tSec.includes('medical') || tSec.includes('clinic') || (tSec.includes('hospital') && !tSec.includes('hospitality'))) {
    if (pSec.includes('hospitality')) return false;
    return pSec.includes('healthcare') || pSec.includes('hospital') || pSec.includes('medical') || pSec.includes('clinic');
  }
  if (tSec.includes('retail') || tSec.includes('mall') || tSec.includes('shopping')) {
    return pSec.includes('retail') || pSec.includes('mall') || pSec.includes('shopping');
  }
  if (tSec.includes('sports') || tSec.includes('stadium') || tSec.includes('arena')) {
    return pSec.includes('sport') || pSec.includes('stadium') || pSec.includes('arena');
  }
  if (tSec.includes('entertainment') || tSec.includes('culture') || tSec.includes('museum') || tSec.includes('theatre')) {
    return pSec.includes('entertain') || pSec.includes('cultur') || pSec.includes('museum') || pSec.includes('theatre');
  }
  if (tSec.includes('public buildings') || tSec.includes('theme park') || tSec.includes('civic')) {
    return pSec.includes('public') || pSec.includes('theme') || pSec.includes('civic') || pSec.includes('park');
  }
  if (tSec.includes('aviation') || tSec.includes('airport') || tSec.includes('terminal')) {
    return pSec.includes('aviation') || pSec.includes('airport') || pSec.includes('terminal');
  }
  if (tSec.includes('villas') || tSec.includes('private estate')) {
    return pSec.includes('villa') || pSec.includes('estate');
  }
  if (tSec.includes('infrastructure') || tSec.includes('sustainable communities') || tSec.includes('sustainability')) {
    return pSec.includes('infrastructur') || pSec.includes('sustainab') || pSec.includes('utility') || pSec.includes('community');
  }
  if (tSec.includes('mixed') || pSec.includes('mixed')) {
    return pSec.includes('mixed') && tSec.includes('mixed');
  }

  return pSec.includes(tSec) || tSec.includes(pSec);
}

