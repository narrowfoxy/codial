const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const profile = (req, res) => {
  res.render("profile");
};

const customProfile = async (req, res) => {
  try {
    const { user_id } = req.params;
    const customUser = await User.findById(user_id);
    req.flash("success", "Profile Loaded Successfully");
    return res.render("profile", { customUser: customUser, user: req.user });
  } catch (err) {
    console.log(err);
    req.flash("error", "Error While loading profile");
  }
};

const signin = (req, res) => {
  return res.render("signin");
};

const signup = (req, res) => {
  return res.render("signup");
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const dbResponse = await User.create({
      name: name,
      email: email,
      password: password,
    });
    req.flash("success", "Profile Loaded Successfully");
  } catch (err) {
    console.log("error while creating user", err);
    req.flash("error", "error while creating user");
  }
  return res.redirect("/signin");
};

const createSession = (req, res) => {
  req.flash("success", "Signed in Successfully");
  return res.redirect("/");
};

const destroySession = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Signed out Successfully");
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
    req.flash("success", "new Post created successfully");
    return res.redirect("/");
  } catch (err) {
    console.log("error creating the post", err);
    req.flash("error", "Error while creating Post");
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
    req.flash("success", "Succesfuly added comment");
    return res.redirect("/");
  } catch (err) {
    req.flash("error", "failed adding comment");
    console.log("error creating the post", err);
    return res.redirect("/");
  }
};

const deletePost = async (req, res) => {
  const { id: post_id } = req.params;
  const post = await Post.findById(post_id);

  try {
    if (post.user == req.user.id) {
      const deletedPost = await Post.findByIdAndRemove(post_id);
      req.flash("success", "successfully deleted post");
    }
  } catch (err) {
    console.log(err);
    req.flash("error", "failed deleting post");
  }

  return res.redirect("back");
};

const deleteComment = async (req, res) => {
  const { id: comment_id } = req.params;

  try {
    const comment = await Comment.findById(comment_id);

    if (comment.user == req.user.id) {
      const deletedComment = await Comment.findByIdAndRemove(comment_id);
      const deleteCommentFromPost = await Post.findByIdAndUpdate(comment.post, {
        $pull: { comment: comment_id },
      });
    }
    req.flash("success", "Deleted comment successfully");
  } catch (err) {
    console.log("Error while deleting comment");
    req.flash("error", "Failed deleting comment");
  }

  return res.redirect("back");
};

const updateProfile = async (req, res) => {
  const { name } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
      name: name,
    });
    req.flash("success", "successfully updated profile");
  } catch (err) {
    console.log("error while updating profile", err);
    req.flash("error", "Failed updating profile");
  }
  res.redirect("back");
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
  deletePost,
  deleteComment,
  customProfile,
  updateProfile,
};
