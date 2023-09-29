export function hasExpired(dateA) {
  return dateA.getUTCSeconds() < new Date().getUTCSeconds();
}

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

//for handling date conversions
export const formatDateToYYYYMMDD = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // January is 0, so we add 1 to get the month number, then pad it to two digits.
  const dd = String(date.getDate()).padStart(2, "0"); // Pad the date to two digits.

  return `${yyyy}-${mm}-${dd}`;
};

export const parseDateFromYYYYMMDD = (dateString) => {
  const [yyyy, mm, dd] = dateString.split("-").map((str) => parseInt(str, 10));

  // Note that the month parameter is zero-based, so we subtract 1 from the parsed month.
  return new Date(yyyy, mm - 1, dd);
};

export const addDurationToDate = (dateObj, durationStr) => {
  const [hours, minutes, seconds] = durationStr.split(":").map(Number);

  dateObj.setHours(dateObj.getHours() + hours);
  dateObj.setMinutes(dateObj.getMinutes() + minutes);
  dateObj.setSeconds(dateObj.getSeconds() + seconds);

  return dateObj;
};

export const maskNric = (nric) => {
  if (nric.length < 9) {
    throw new Error("The string should be at least 9 characters long.");
  }
  const firstPart = nric
    .substring(0, nric.length - 4)
    .replace(/.(?=.{4,}$)/g, "X");
  const lastPart = nric.slice(-4);
  return firstPart + lastPart;
};
