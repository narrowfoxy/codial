const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const profile = (req, res) => {
  res.render("profile");
};

const signin = (req, res) => {
  res.render("signin");
};

const signup = (req, res) => {
  res.render("signup");
};

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const dbResponse = await User.create({
    name: name,
    email: email,
    password: password,
  });
  res.redirect("back");
};

const createSession = (req, res) => {
  res.redirect("/");
};

const destroySession = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    return res.redirect("/");
  });
};

const createPost = async (req, res) => {
  const { post_content } = req.body;
  const { id } = req.user;

  try {
    const newPost = await Post.create({
      content: post_content,
      user: id,
    });
    return res.redirect("/");
  } catch (err) {
    console.log("error creating the post", err);
    return res.redirect("/");
  }
};

const createComment = async (req, res) => {
  const { post_comment, post_id } = req.body;
  const { id } = req.user;

  try {
    const availablePost = await Post.findById(post_id);

    if (availablePost) {
      const newComment = await Comment.create({
        content: post_comment,
        post: post_id,
        user: id,
      });
      availablePost.comment.push(newComment._id);
      await availablePost.save();
    }
    return res.redirect("/");
  } catch (err) {
    console.log("error creating the post", err);
    return res.redirect("/");
  }
};

module.exports = {
  signin,
  signup,
  profile,
  register,
  createSession,
  destroySession,
  createPost,
  createComment,
};
