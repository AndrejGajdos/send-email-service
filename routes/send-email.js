var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
require("dotenv").config({
  path: `.env.keys`,
});

const getHostname = (url) => {
  // use URL constructor and return hostname
  return new URL(url).hostname;
};

router.post("/", function (req, res, next) {
  const data = JSON.stringify(req.body, null, 4);

  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    auth: {
      user: process.env.SOURCE_ADDRESS,
      pass: process.env.PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions = {
    from: process.env.SOURCE_ADDRESS,
    to: process.env.DESTINATION_ADDRESS,
    subject: "[survey-widget] " + getHostname(req.body.url), // Subject line
    text: data,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    res.send("Message send Successfully");
  });
});

module.exports = router;
