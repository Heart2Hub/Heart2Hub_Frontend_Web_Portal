export function hasExpired(dateA) {
  return dateA.getUTCSeconds() < new Date().getUTCSeconds();
}

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));
