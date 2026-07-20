import {Router} from 'express';
import {postMovies , getMovies , movieDetails} from '../controllers/movie.controller.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import {upload} from '../middlewares/multer.middleware.js';

const router = Router();
router.post(
  "/postMovies",
  upload.fields([
    {
      name: "poster",
      maxCount: 1,
    },
  ]),
  postMovies
);
router.get('/getMovies', getMovies);
router.get('/movieDetails/:id', movieDetails);

export default router;