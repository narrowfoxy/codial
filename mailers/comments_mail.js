const nodemailer = require("../config/nodemailer");

module.exports.newMail = (user, comment) => {
  nodemailer.transporter.sendMail(
    {
      from: "codial app",
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
