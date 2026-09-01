/** Format a Date as `YYYY-MM-DD` for `<input type="date">`. */
export function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parse `YYYY-MM-DD` from a date input into a local Date. */
export function fromDateInputValue(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Today's date as `YYYY-MM-DD` — use from Server Components for stable SSR/hydration. */
export function getTodayDateInputValue() {
  return toDateInputValue(new Date());
}
