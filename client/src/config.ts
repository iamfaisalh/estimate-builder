export const REACT_APP_SERVER_URL =
  process.env["NODE_ENV"] === "production"
    ? "/api"
    : process.env["REACT_APP_SERVER_URL"];
