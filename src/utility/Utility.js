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

export const parseDateFromLocalDateTime = (localDateTime) => {
  // console.log(localDateTime)
  if (localDateTime !== null && localDateTime.length < 6) {
    return new Date(localDateTime[0], localDateTime[1] - 1, localDateTime[2]);
  }
  return new Date(
    localDateTime[0],
    localDateTime[1] - 1,
    localDateTime[2],
    localDateTime[3],
    localDateTime[4],
    localDateTime[5]
  );
};

export const parseDateFromLocalDateTimeWithSecs = (localDateTime) => {
  if (localDateTime !== null && localDateTime.length <= 6) {
    return new Date(
      localDateTime[0],
      localDateTime[1] - 1,
      localDateTime[2],
      localDateTime[3],
      localDateTime[4]
    );
  }
  return new Date(
    localDateTime[0],
    localDateTime[1] - 1,
    localDateTime[2],
    localDateTime[3],
    localDateTime[4],
    localDateTime[5],
    localDateTime[6]
  );
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
  const firstPart = nric.substring(0, 1);
  const lastPart = nric.slice(-4);
  return firstPart + "XXXX" + lastPart;
};

export function calculateAge(dateOfBirth) {
  // console.log(dateOfBirth);
  if (dateOfBirth === undefined) {
    return;
  }
  let birthday = parseDateFromLocalDateTime(dateOfBirth);
  let year = birthday.getFullYear();
  let month = birthday.getMonth();
  let day = birthday.getDay();

  // const [year, month, day, hour, minutes, seconds] = birthday;

  const birthDate = new Date(year, month - 1, day);
  const currentDate = new Date();

  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDifference = currentDate.getMonth() - birthDate.getMonth();

  // If the birthday hasn't occurred yet this year, subtract 1 from the age.
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text; // No need to truncate
  }

  // Truncate the text and add an ellipsis
  return text.slice(0, maxLength) + "...";
}

export const formatDateToYYYYMMDDHHMM = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // January is 0, so we add 1 to get the month number, then pad it to two digits.
  const dd = String(date.getDate()).padStart(2, "0"); // Pad the date to two digits.

  const hh = String(date.getHours()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:00`;
};
