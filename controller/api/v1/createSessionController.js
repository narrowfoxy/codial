const User = require("../../../models/User");
var jwt = require("jsonwebtoken");

const createSessionController = async (req, res) => {
  const { email, password } = req.body|| {};

  const user = await User.findOne({ email: email });

  if (user.password == password) {
    var token = jwt.sign(user.toJSON(), "codial");
    return res.json(200, { token: token });
  } else {
    return res.json(401, { err: "user not found with this creds" });
  }
};

module.exports = createSessionController;
