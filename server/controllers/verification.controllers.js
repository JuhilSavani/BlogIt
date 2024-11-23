import nodemailer from "nodemailer";
import { User } from "../models/user.model.js";
import { google } from "googleapis";
import { configDotenv } from "dotenv";

configDotenv();

const CLIENT_ID = process.env.GMAIL_CLIENT_ID; 
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET; 
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI; 
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN; 

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export const verifyEmail = async (req, res) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const { email } = req.params;

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const senderEmail = process.env.SENDER_EMAIL;
    
    const transporter = nodemailer.createTransport({
      pool: true,
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: senderEmail, 
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
      maxConnections: 5, // Adjust the max number of connections in the pool
      maxMessages: 10,   // Adjust the max number of messages per connection
      rateLimit: 10,     // Rate limit to control the number of messages sent per second
    });

    const mailOptions = {
      from: `BlogIt <${senderEmail}>`,
      to: email,
      subject: "Verify Your Email Address With BlogIt",
      html: `
        <h1>Email Verification</h1>
        <p>Your verification code is:</p>
        <h2 style="color: #2d89ef;">${verificationCode}</h2>
        <p>Please enter this code on the verification page to complete your registration.</p>
        <p>If you did not sign up for BlogIt, please ignore this email.</p>
        <p>Thank you,</p>
        <p>The BlogIt Team</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result);
    return res.status(200).json({ verificationCode });
  } catch (err) {
    console.error("[SERVER - verifyEmail] Error:", err);
    return res
      .status(500)
      .json({ message: "An error occurred while sending mail to verify your account." });
  }
};

export const verifyAccount = async (req, res) => {
  try {

    const { email, username } = req.body;

    const existingUser = await User.findOne({ username }).select("_id");
    if (existingUser) return res.status(409).json({ message: "User already exists." });

    const existingEmail = await User.findOne({ email }).select("_id");
    if (existingEmail) return res.status(409).json({ message: "Email already exists." });
    
    return res.sendStatus(201);
  } catch (err) {
    console.error("[SERVER - verifyUser] Error:", err);
    return res
      .status(500)
      .json({ message: "An error occurred while validating your account details." });
  }
}


