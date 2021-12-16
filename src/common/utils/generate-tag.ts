export function generateRandomTag() {
  const randomNumber = Math.floor(Math.random() * 10000);
  const randomStr = randomNumber.toString();
  return randomStr.length >= 4
    ? randomStr
    : new Array(4 - randomStr.length + 1).join('0') + randomStr;
}
