import mongoose , { Schema } from "mongoose";

const eventSchema = new Schema({
  organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['music' , 'nightlife' , 'comedy' , 'sports'
    , 'conference' , 'food' , 'festival' , 'theater' , 'workshop' , 'fitness'
  ], default: 'music' },
  coverImage: { type: String },
  images: [{ type: String }],
  venue: {
    name: String,
    address: String,
    city: String,
  },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  status: { type: String, enum: ['draft', 'published', 'cancelled', 'completed'], default: 'draft' },
  attendeeCount: { type: Number, default: 0 },
  tags: [{ type: String }],
}, { timestamps: true });

export const Event = mongoose.model("Event" , eventSchema);
