import nodemailer from "nodemailer";
import "dotenv/config.js";

const { SEND_MAIL_PASSWORD, SEND_MAIL_FROME } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: SEND_MAIL_FROME,
    pass: SEND_MAIL_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = (data) => {
  const email = { ...data, from: SEND_MAIL_FROME };

  return transport.sendMail(email);
};

export default sendEmail;
