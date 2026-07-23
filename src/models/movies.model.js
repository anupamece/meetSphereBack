import mongoose from "mongoose";
const movieSchema = new mongoose.Schema(
  {
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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
    ticketPrice: { 
      type: Number, 
      default: 0 , 
      min: 0 
    },
    totalTickets: { 
      type: Number, 
      default: 50 , 
      min: 1 
    },
    ticketsSold: { 
      type: Number, 
      default: 0 
    },
    theatre:{
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;