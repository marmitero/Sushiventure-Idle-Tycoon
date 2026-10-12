/**
 * City areas (hub districts). The HUD area badge (kit `HubAreaBar`) shows the
 * district the restaurant currently sits in — the same value the city map
 * (Fase 6) will use as its starting marker, so the badge never displays a
 * fictional place: it reads real world config.
 *
 * Reference: Screenshot_7.png top-left badge ("CENTER PARK" in the kit mock,
 * pt-BR here per product language priority).
 */
export interface AreaDef {
  id: string;
  name: string;
}

export const AREAS: readonly AreaDef[] = [
  { id: 'centro', name: 'CENTRO' },
] as const;

export const START_AREA: AreaDef = AREAS[0] as AreaDef;
