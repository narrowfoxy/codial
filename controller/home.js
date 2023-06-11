const Post = require("../models/Post");
const User = require("../models/User");
const io = require("../config/socket");
const Friend = require("../models/Friend");
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

    if (req.user) {
      const nonNotifiedFriends = await Friend.find({
        to: req.user.id,
        notified: false,
      });

      nonNotifiedFriends.map(async (notify) => {
        const friend = await Friend.findById(notify.id)
          .populate("to")
          .populate("from");
        setTimeout(() => {
          io.sockets.in(req.user.email).emit("friendRequest", {
            message: `you recieved a new friend request from ${friend.from.name}`,
            friendId: friend.id,
          });
        }, 5000);
      });
    }

    return res.render("home", { posts: posts || [], users });
  } catch (err) {
    console.log("Error while fetching the Posts", err);
    return res.render("home");
  }
};

module.exports = home;
