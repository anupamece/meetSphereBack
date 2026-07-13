import {Event} from "../models/events.model.js";
import { Favorite } from "../models/favorite.model.js";

const createEvent = async (req , res)=>{
  try{
      const {title , description , category , startDateTime , endDateTime , status , attendeeCount} = req.body;
      const coverImageFile = req.files?.coverImage?.[0];
      const imageFiles = req.files?.images || [];

      if(!title || !description || !category || !startDateTime || !endDateTime || !coverImageFile){
          return res.status(400).json({message : "Missing required fields"});
      }

      let tags = [];
      if (req.body.tags) {
        try {
          tags = JSON.parse(req.body.tags);
        } catch (error) {
          return res.status(400).json({ message: "Invalid tags format" });
        }
      }

      const venue = {
        name: req.body.venueName || "",
        address: req.body.venueAddress || "",
        city: req.body.venueCity || "",
      };

      const newEvent = await Event.create({
        organizer: req.user._id,
        title,
        description,
        category,
        coverImage: coverImageFile.path,
        images: imageFiles.map((file) => file.path),
        venue,
        startDateTime,
        endDateTime,
        status,
        attendeeCount,
        tags
      })
      return res.status(201).json({message : "Event created successfully" , event : newEvent
      })
  }
  catch(err){ 
    return res.status(500).json({message : "Error creating event"});
  }
}

const getEvents = async (req , res)=>{
  try{
    const limit= parseInt(req.query.limit) || 10; // Default limit is 10

    const events= await Event.aggregate([
      {$sample: {size: limit}}
    ]);
    return res.status(200).json({message : "Events fetched successfully" , events : events});
  }
  catch(err){
    console.log(err)
    return res.status(500).json({message : "Error fetching events!!"});
    
  }
}

const isfav = async (req , res)=>{
  try{
    const eventId = req.params.id;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if(!event){
      return res.status(404).json({message : "Event not found"});
    }

    const existingFavorite = await Favorite.findOne({ user: userId, event: eventId });

    if (existingFavorite) {
      await Favorite.deleteOne({ _id: existingFavorite._id });
      return res.status(200).json({message : "Favorite removed successfully" , isfavorite : false});
    }

    await Favorite.create({ user: userId, event: eventId });
    return res.status(200).json({message : "Favorite added successfully" , isfavorite : true});
  }
  catch(err){
    return res.status(500).json({message : "Error updating favorite status"});
  }
}

const eventDetails = async(req , res)=>{
    try{
       const eventId = req.params.id;
       const event = await Event.findById(eventId);
       if (!event) {
         return res.status(404).json({message : "Event not found"});
       }
       return res.status(200).json({message : "Event details fetched successfully" , event : event}); 
    }
    catch(err){
        return res.status(500).json({message : "Error fetching event details"});
    }
}

export {createEvent , getEvents , isfav, eventDetails};
