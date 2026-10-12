/**
 * World layout constants (world units = native asset pixels of the kit).
 * The tower grows upward (negative Y); the street lives at Y >= 0.
 */
export const TOWER = {
  width: 1056,
  floorHeight: 340,
  cashierHeight: 412,
  /** World Y of the sidewalk top (street texture origin). */
  streetTop: 0,
  /** World Y where the storefront art base sits (slightly into the sidewalk). */
  cashierBottom: 70,
  get cashierTop(): number {
    return this.cashierBottom - this.cashierHeight;
  },
  floorBottom(index: number): number {
    return this.cashierTop - this.floorHeight * index;
  },
  floorCenterY(index: number): number {
    return this.floorBottom(index) - this.floorHeight / 2;
  },
  shaftX: -330,
  cashierGirlX: -352,
  cashierGirlY: -140,
  chefX: 0,
  chefY: 46,
  /** World Y of the two traffic lanes inside bg.street (native scale). */
  roadFarLaneY: 225,
  roadNearLaneY: 305,
  /** Blank wooden plank baked into every Floor_Lv*.png: the kit expects the
   *  floor label to be drawn on top of it (see Screenshot_7.png reference). */
  plateX: -58,
  plateDy: 270,
  /** Per-floor upgrade badge (green square + arrow) hugging the right edge. */
  badgeX: 536,
  badgeDy: 190,
  /** Grey band of the locked slab where the reference puts the price button. */
  nextSlotDy: 200,
  chefRange: 380,
  floorGirlX: 210,
  floorGirlY(index: number): number {
    return this.floorCenterY(index) + 78;
  },
  cameraFitWidth: 1150,
  minZoom: 0.4,
  maxZoom: 1.05,
} as const;
