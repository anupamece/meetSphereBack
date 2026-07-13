import { Favorite } from "../models/favorite.model.js";

const favEvents = async (req, res) => {
  try{
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const favorites = await Favorite.find({ user: req.user._id }).populate("event");
    const events = favorites
      .map((favorite) => favorite.event)
      .filter(Boolean);

    return res.status(200).json({message : "Favorite events fetched successfully" , events});
  }
  catch(err){
    return res.status(500).json({message : "Error fetching favorite events"});
  }
}

export {favEvents};
