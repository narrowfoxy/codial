const nodemailer = require("../config/nodemailer");
const env = require("../config/environment-managaer");

module.exports.newMail = (user, comment) => {
  nodemailer.transporter.sendMail(
    {
      from: env.APP_NAME,
      to: comment.user.email,
      subject: "New Comment is Added",
      html: nodemailer.renderTemplate({ comment: comment, user: user }, "new_mail.ejs"),
    },
    (err, info) => {
      if (err) {
        console.log(err, "error while mailing");
      } else {
        console.log("Mailed successfully");
      }
      return;
    }
  );
};
