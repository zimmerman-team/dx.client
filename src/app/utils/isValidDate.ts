import moment from "moment";

export function isValidDate(dateString: string) {
  const date = moment(dateString, moment.ISO_8601, true);
  return date.isValid();
}
