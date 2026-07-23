import {Router} from 'express';
import {getEvents,createEvent , isfav , eventDetails, fetchOrganiserEvents,deleteHostEvent} from '../controllers/event.controller.js';
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
router.get('/my-events', verifyJWT, fetchOrganiserEvents);
router.post('/isfav/:id', verifyJWT, isfav);
router.get('/eventDetails/:id', eventDetails);
router.post('/deleteEvent/:id', verifyJWT, deleteHostEvent);

export default router;
