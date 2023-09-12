export function hasExpired(dateA) {
  return dateA.getUTCSeconds() < new Date().getUTCSeconds();
}
