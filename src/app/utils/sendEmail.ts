import nodemailer from "nodemailer";
import config from "../config";
import fs from "fs";
import juice from "juice";
import path from "path";
import AppError from "../errors/AppError";
import httpStatus from "http-status";

export const sendEmail = async (
  toEmail: string,
  username: string,
  phone: string,
  roomId: number,
  bookingDate: string
) => {
  const htmlTemplatePath = path.join(__dirname, "../views/bookHotel.html");

  let htmlTemplate;
  try {
    htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf8");
  } catch (err: any) {
    throw new AppError(httpStatus.BAD_REQUEST, err);
  }

  const replacements = {
    username: username,
    phone: phone,
    roomId: roomId,
    bookingDate: bookingDate,
    userEmail: toEmail,
  };

  let inlineHtml = htmlTemplate;

  for (const placeholder in replacements) {
    inlineHtml = inlineHtml.replace(
      new RegExp(`{{${placeholder}}}`, "g"),
      replacements[placeholder as keyof typeof replacements] as string
    );
  }

  const inlineHtmlWithStyles = juice(inlineHtml);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: config.node_env === "production" ? 465 : 587,
    secure: config.node_env === "production", // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.nodemailer_email,
      pass: config.nodemailer_password,
    },
  });

  await transporter.sendMail({
    from: '"HotelQuest"', // sender address
    to: toEmail, // sender
    subject: "Congratulation your booking is created", // Subject line
    text: "Your room was successfully booked. Thank you for choosing us.", // plain text body
    html: inlineHtmlWithStyles, // html body
  });
};
