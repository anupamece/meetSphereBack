import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";

import {
    initiateBooking,
    simulatePayment,
    confirmBooking,getMyBookings,
    getBookingById,getEventAttendees,
    getOrganizerStats,cancelBooking
} from "../controllers/booking.controller.js";


const router=Router();

//booking cycle
router.post("/initiate",verifyJWT,initiateBooking);
router.post("/simulate-payment",verifyJWT,simulatePayment);
router.post("/confirm",verifyJWT,confirmBooking);

//organizer endpoints
router.get("/stats",verifyJWT,getOrganizerStats);
router.get("/event/:itemId/attendees",verifyJWT,getEventAttendees);

//User Bookings
router.get("/my-bookings",verifyJWT,getMyBookings);
router.get("/:id",verifyJWT,getBookingById);
router.post("/:id/cancel",verifyJWT,cancelBooking);


export default router;