const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_CODE,
  },
});

let renderTemplate = (data, relativePath) => {
  let emailHtml;
  ejs.renderFile(
    path.join(__dirname, "../views/mailer", relativePath),
    data,
    function (err, template) {
      if (err) {
        console.log("err causing while template", err);
        return;
      }

      emailHtml = template;
    }
  );

  return emailHtml;
};

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate,
};
