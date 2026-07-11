import {Event} from "../models/events.model.js";

const createEvent = async (req , res)=>{
  const {organizer , title , description , category , coverImage , images , venue , startDateTime , endDateTime , status , attendeeCount , tags} = req.body;
  try{
      if(!organizer || !title || !description || !category || !coverImage ){
          return res.status(400).json({message : "Missing required fields"});
      }
      const newEvent = Event.create({
        organizer,
        title,
        description,
        category,
        coverImage,
        images,
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
    throw new Error("Error creating event");
  }
}

const getEvents = async (req , res)=>{
  try{
    const events = await Event.find();
    return res.status(200).json({message : "Events fetched successfully" , events : events});
  }
  catch(err){
    throw new Error("Error fetching events");
  }
}

export {createEvent , getEvents};

