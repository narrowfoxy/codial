const Post = require("../models/Post");
const User = require("../models/User");

const home = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("user")
      .populate({
        path: "comment",
        populate: { path: "user" },
      })
      .exec();
    
    const users = await User.find({});

    return res.render("home", { posts, users });
  } catch (err) {
    console.log("Error while fetching the Posts", err);
    return res.render("home");
  }
};

module.exports = home;
