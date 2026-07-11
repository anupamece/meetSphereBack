import {Router} from 'express';
import {getEvents,createEvent} from '../controllers/event.controller.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';
const router = Router();

router.post('/createEvents', verifyJWT, createEvent);
router.get('/getEvents', getEvents);

export default router;