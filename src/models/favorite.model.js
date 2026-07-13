import mongoose, { Schema } from "mongoose";

const favoriteSchema = new Schema(
  {
    
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  },
  { timestamps: true }
);

favoriteSchema.index({ user: 1, event: 1 }, { unique: true });

export const Favorite = mongoose.model("Favorite", favoriteSchema);