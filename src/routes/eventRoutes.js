import { Router } from "express";
import {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
} from "../controllers/eventController.js";
import validateRequestBody from "../middlewares/validateRequestBody.js";
import validateFields_createEvent from "../middlewares/events/validateFields_createEvent.js";
import validateFields_updateEvent from "../middlewares/events/validateFields_updateEvent.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";


const router = Router();


// ======= Get all events (public) =======
router.get("/", getEvents);


// ======= Get single event (public) =======
router.get("/:id", getEvent);


// ======= Create new event (admin only) =======
router.post(
    "/",
    protect,
    authorize(["admin"]),
    validateRequestBody,
    validateFields_createEvent,
    createEvent,
);


// ======= Update event (admin only) =======
router.put(
    "/:id",
    protect,
    authorize(["admin"]),
    validateRequestBody,
    validateFields_updateEvent,
    updateEvent,
);


// ======= Delete event (admin only) =======
router.delete("/:id", protect, authorize(["admin"]), deleteEvent);


export default router;
