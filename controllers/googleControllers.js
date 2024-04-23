import queryString from "query-string";
import axios from "axios";
import googleAuthenticator from "../helpers/googleAuthenticator.js";
import controllerWrapper from "../helpers/ctrlWrapper.js";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BASE_URL_CLIENT } = process.env;

const googleAuth = async (req, res) => {
  console.log("Hello from googleAuth !");

  const stringifiedParams = queryString.stringify({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${BASE_URL_CLIENT}/api/auth/google-redirect`,
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });
  res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
  );
};

const googleRedirect = async (req, res) => {
  console.log("Hello from googleRedirect !");

  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search);
  const code = urlParams.code;

  const tokenData = await axios({
    url: "https://oauth2.googleapis.com/token",
    method: "post",
    data: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `${BASE_URL_CLIENT}/api/auth/google-redirect`,
      grant_type: "authorization_code",
      code,
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const userData = await axios({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });

  const token = await googleAuthenticator(userData.data);

  res.redirect(`${BASE_URL_CLIENT}?token=${token}`);
};

export default {
  googleAuth: controllerWrapper(googleAuth),
  googleRedirect: controllerWrapper(googleRedirect),
};
