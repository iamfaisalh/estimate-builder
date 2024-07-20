export const generateRandomString = (
  length: number = 5,
  numbers_only?: boolean
) => {
  const chars = numbers_only
    ? "0123456789"
    : "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

export const toTitle = (string: string) => {
  return string
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};
