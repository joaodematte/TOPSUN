export const EMPTY_VALUE = "—";

export function isValueEmpty(
  value: string | number | null | undefined
): boolean {
  return value === null || value === undefined || value === "";
}

export function formatValue(value: string | number | null | undefined): string {
  return isValueEmpty(value) ? EMPTY_VALUE : String(value);
}
