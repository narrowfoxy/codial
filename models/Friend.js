const mongoose = require("mongoose");

const friendSchema = mongoose.Schema(
  {
    to: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    accepted: {
      type: Boolean,
      required: true,
      default: false,
    },
    notified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Friend = mongoose.model("Friend", friendSchema);

module.exports = Friend;
