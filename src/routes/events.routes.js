import {Router} from 'express';
<<<<<<< HEAD
import {getEvents,createEvent,fetchOrganiserEvents} from '../controllers/event.controller.js';
=======
import {getEvents,createEvent , isfav} from '../controllers/event.controller.js';
>>>>>>> 9ec131c (backend fav)
import {verifyJWT} from '../middlewares/auth.middleware.js';
import {upload} from '../middlewares/multer.middleware.js';

const router = Router();

router.post(
  '/createEvents',
  verifyJWT,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'images', maxCount: 8 },
  ]),
  createEvent
);
router.get('/getEvents', getEvents);
<<<<<<< HEAD
router.get('/my-events',verifyJWT,fetchOrganiserEvents)
=======
router.post('/isfav/:id', verifyJWT, isfav);
>>>>>>> 9ec131c (backend fav)

export default router;
