import {Router} from 'express';
import {favEvents} from '../controllers/fav.controllers.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/favEvents', verifyJWT, favEvents);

export default router;