const Post = require("../models/Post");

const home = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("user")
      .populate({
        path: "comment",
        populate: { path: "user" },
      })
      .exec();
    return res.render("home", { posts });
  } catch (err) {
    console.log("Error while fetching the Posts", err);
    return res.render("home");
  }
};

module.exports = home;
