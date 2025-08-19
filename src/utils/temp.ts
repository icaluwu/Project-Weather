export type Unit = "C" | "F";

export const toF = (c: number) => (c * 9) / 5 + 32;
export const toC = (f: number) => ((f - 32) * 5) / 9;

export function formatTemp(x: number, unit: Unit) {
  return unit === "C" ? `${x.toFixed(1)}°C` : `${toF(x).toFixed(1)}°F`;
}
