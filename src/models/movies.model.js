import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    poster: {
      type: String,
      required: true,
    },
    trailer: {
      type: String,
    },

    genre: [
      {
        type: String,
      },
    ],

    language: {
      type: String,
      required: true,
    },

    duration: {
      type: Number, // Minutes
      required: true,
    },

    releaseDate: {
      type: Date,
      required: true,
    },

    certificate: {
      type: String,
      enum: ["U", "UA", "A", "S"],
    },

    director: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Upcoming", "Now Showing", "Ended"],
      default: "Upcoming",
    },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;