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
  isfavorite: { type: Boolean, default: false },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  status: { type: String, enum: ['draft','upcoming','live','completed'], default: 'draft' },
  attendeeCount: { type: Number, default: 0 },
  tags: [{ type: String }],
  ticketPrice: { type: Number, default: 0 , min: 0 },
  totalTickets: { type: Number, default: 50 , min: 1 },
  ticketsSold: { type: Number, default: 0 },
  
}, { timestamps: true });

const Event = mongoose.model("Event" , eventSchema);
export default Event;
