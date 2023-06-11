const User = require("../models/User");
const Post = require("../models/Post");
const Like = require("../models/Likes");
const Comment = require("../models/Comment");
const commentMailer = require("../mailers/comments_mail");
const kue = require("../config/kue");
const Friend = require("../models/Friend");
const io = require("../config/socket");

const profile = (req, res) => {
  res.render("profile");
};

const friendRequest = async (req, res) => {
  const { to, from } = req.body;
  const friend = await Friend.create({
    to: to,
    from: from,
  });

  const fromUser = await User.findById(from);
  const toUser = await User.findById(to);
  fromUser.sendPendingFriends.push(friend);
  await fromUser.save();
  toUser.receivedPendingFriends.push(friend);
  await toUser.save();
  console.log("friend Request Received");
  io.sockets
    .in(toUser.email)
    .timeout(5000)
    .emit("friendRequest", {
      message: `you recieved a new friend request from ${fromUser.name}`,
      friendId: friend.id,
    });
  return res.json(friend);
};

const acceptRequest = async (req, res) => {
  const { to, from, friendId } = req.body;
  const friend = await Friend.findByIdAndUpdate(friendId, {
    accepted: true,
  });
  console.log(friend);
  const fromUser = await User.findByIdAndUpdate(from, {
    $pull: { sendPendingFriends: friendId },
  });
  const toUser = await User.findByIdAndUpdate(to, {
    $pull: { receivedPendingFriends: friendId },
  });
  const updateFromUser = await User.findById(from);
  const updateToUser = await User.findById(to);
  updateFromUser.friends.push(friendId);
  updateToUser.friends.push(friendId);
  await updateFromUser.save();
  await updateToUser.save();

  return res.json({ success: "Added Friend" });
};

const like = async (req, res) => {
  const { onModelType, modelId } = req.params;

  switch (onModelType) {
    case "Comment": {
      const existingLike = await Like.findOne({
        user: req.user.id,
        onModel: onModelType,
        likeable: modelId,
      });
      if (existingLike) {
        await Like.findByIdAndRemove(existingLike.id);
        await Comment.findByIdAndUpdate(existingLike.likeable, {
          $pull: { likes: existingLike.id },
        });
        return res.json(existingLike);
      } else {
        const newLike = await Like.create({
          user: req.user.id,
          onModel: onModelType,
          likeable: modelId,
        });
        console.log(newLike);
        const comment = await Comment.findById(modelId);
        comment.likes.push(newLike);
        await comment.save();
        return res.json(newLike);
      }
    }
    case "Post": {
      const existingLike = await Like.findOne({
        user: req.user.id,
        onModel: onModelType,
        likeable: modelId,
      });
      if (existingLike) {
        await Like.findByIdAndRemove(existingLike.id);
        await Post.findByIdAndUpdate(existingLike.likeable, {
          $pull: { likes: existingLike.id },
        });
        return res.json(existingLike);
      } else {
        const newLike = await Like.create({
          user: req.user.id,
          onModel: onModelType,
          likeable: modelId,
        });
        const post = await Post.findById(modelId);
        post.likes.push(newLike);
        await post.save();
        return res.json(newLike);
      }
    }
  }
};

const customProfile = async (req, res) => {
  try {
    const { user_id } = req.params;
    const customUser = await User.findById(user_id);
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
  return res.redirect("/user/signin");
};

const createSession = (req, res) => {
  req.flash("success", "Signed in Successfully");
  req.flash("signin", true);
  return res.redirect("/");
};

const destroySession = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Signed out Successfully");
    req.flash("signout", true);
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
    const fetchedNewPost = await Post.findById(newPost.id)
      .populate("user", "name")
      .exec();
    return res
      .status(200)
      .json({ data: fetchedNewPost, success: "new Post created successfully" });
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

    var newComment = {};
    var newlyCreatedComment = {};

    if (availablePost) {
      newComment = await Comment.create({
        content: post_comment,
        post: post_id,
        user: id,
      });
      availablePost.comment.push(newComment._id);
      await availablePost.save();
      newlyCreatedComment = await Comment.findById(newComment.id)
        .populate("user", "name email")
        .exec();
    }
    kue
      .create("email", {
        title: "Create new Comment",
      })
      .delay(10000)
      .priority("high")
      .attempts(5)
      .save();

    kue.process("email", function (job, done) {
      commentMailer.newMail(req.user, newlyCreatedComment);
    });

    return res.status(200).json({
      comment: newlyCreatedComment,
      success: "successfully added comment",
    });
  } catch (err) {
    req.flash("error", "failed adding comment");
    console.log("error creating the post", err);
    return res.redirect("/");
  }
};

const deletePost = async (req, res) => {
  const { id: post_id } = req.params;
  const post = await Post.findById(post_id);

  var flashMessage = {};

  try {
    if (post.user == req.user.id) {
      const deletedPost = await Post.findByIdAndRemove(post_id);
      flashMessage.success = "successfully deleted post";
    }
  } catch (err) {
    console.log(err);
    flashMessage.error = "successfully deleted post";
  }

  return res.status(200).json(flashMessage);
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
    return res.status(200).json({ success: "Deleted comment successfully" });
  } catch (err) {
    console.log(err, "Error while deleting comment");
    return req.flash("error", "Failed deleting comment");
  }
};

const updateProfile = async (req, res) => {
  const flashMessage = {};
  try {
    User.uploadAvatar(req, res, async function (err) {
      if (err) {
        console.log(err, "error while uploading the user image");
      } else {
        const { name } = req.body;
        const updatedUser = await User.findById(req.user.id);
        if (req.file) {
          updatedUser.avatar = User.avatarPath + "/" + req.file.filename;
        }
        if (name) {
          updatedUser.name = name;
        }
        await updatedUser.save();
        return res.status(200).json({
          data: updatedUser,
          ...flashMessage,
        });
      }
    });
    flashMessage.success = "successfully updated profile";
  } catch (err) {
    console.log("error while updating profile", err);
    flashMessage.error = "Failed updating profile";
    return res.status(200).json({
      data: {},
      ...flashMessage,
    });
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
  deletePost,
  deleteComment,
  customProfile,
  updateProfile,
  like,
  friendRequest,
  acceptRequest,
};
