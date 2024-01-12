const host = process.env.NEXT_PUBLIC_SERVER_HOST;
const useSSL = process.env.NEXT_PUBLIC_SERVER_USE_SSL === "true" || false;
const httpProtocol = useSSL ? "https" : "http";

export const config = {
  API_URI: `${httpProtocol}://${host}`,
  COOKIES: {
    ACCESS_TOKEN: "Authentication",
  }
};