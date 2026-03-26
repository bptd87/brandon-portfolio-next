const UTC_DATE_FORMATTERS = {
  short: new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
  long: new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  }),
  year: new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    year: "numeric",
  }),
} as const;

export type UtcDateFormatStyle = keyof typeof UTC_DATE_FORMATTERS;

const normalizeDate = (value: string | Date | null | undefined) => {
  if (!value) return null;
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export function formatUtcDate(
  value: string | Date | null | undefined,
  style: UtcDateFormatStyle = "short"
) {
  const date = normalizeDate(value);
  if (!date) return null;
  return UTC_DATE_FORMATTERS[style].format(date);
}

export function getUtcYear(value: string | Date | null | undefined) {
  const date = normalizeDate(value);
  if (!date) return null;
  return String(date.getUTCFullYear());
}
