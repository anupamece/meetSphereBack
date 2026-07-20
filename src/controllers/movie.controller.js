import Movie from "../models/movies.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const postMovies = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const {
      title,
      description,
      trailer,
      language,
      duration,
      releaseDate,
      certificate,
      director,
      status,
      genre,
    } = req.body;

    const posterFile = req.files?.poster?.[0];

    if (
      !title ||
      !description ||
      !language ||
      !duration ||
      !releaseDate ||
      !posterFile
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const uploadedPoster = await uploadOnCloudinary(posterFile.path);

    console.log("Uploaded Poster:", uploadedPoster);

    const movie = await Movie.create({
      title,
      description,
      poster: uploadedPoster.secure_url,
      trailer,
      language,
      duration,
      releaseDate,
      certificate,
      director,
      status,
      genre: genre.split(",").map((g) => g.trim()),
    });

    return res.status(201).json({
      message: "Movie created successfully",
      movie,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
      stack: err.stack,
    });
  }
};

const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    return res.status(200).json({
      message: "Movies fetched successfully",
      movies,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error fetching movies",
      stack: err.stack,
    });
  }
}

const movieDetails = async (req, res) => {
  try{
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId);

    if(!movie){
      return res.status(404).json({message : "Movie not found"});
    }

    return res.status(200).json({message : "Movie details fetched successfully" , movie});
  }
  catch(err){
    return res.status(500).json({message : "Error fetching movie details"});
  }
}

export { postMovies, getMovies, movieDetails };