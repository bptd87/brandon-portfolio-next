export type PaintBrand = "Sherwin-Williams" | "Benjamin Moore" | "BEHR";

export interface CommercialPaint {
  id: string;
  brand: PaintBrand;
  code: string;
  name: string;
  hex: string;
  rgb: [number, number, number];
  family: string;
}

export const BRAND_FILTERS: PaintBrand[] = ["Sherwin-Williams", "Benjamin Moore", "BEHR"];

export const COMMERCIAL_PAINT_COUNTS: Record<PaintBrand, number> = {
  "Sherwin-Williams": 1526,
  "Benjamin Moore": 3919,
  BEHR: 4699,
};
