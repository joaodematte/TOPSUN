import { EMPTY_VALUE, isValueEmpty } from "./table";

export function formatLocalizedDate(value: string): string {
  if (isValueEmpty(value)) {
    return EMPTY_VALUE;
  }

  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("pt-BR").format(date);
}
