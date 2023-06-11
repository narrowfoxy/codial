const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const env = require("./environment-managaer");

let transporter = nodemailer.createTransport(env.MAIL_CONFIG);

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
