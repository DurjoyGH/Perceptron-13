const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    voteID: { type: String, required: true },
    voteTitle: { type: String, required: true },
    voteOptions: { type: [String], required: true },
    voteDescription: { type: String, required: true },
    voteStartTime: { type: Date, required: true },
    voteEndTime: { type: Date, required: true },
    voteStatus: {
      type: String,
      enum: ["active", "inactive", "completed"],
      default: "active",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  },
  { timestamps: true }
);

const Vote = mongoose.model("Vote", voteSchema);

module.exports = Vote;