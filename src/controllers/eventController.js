import Event from "../models/Event.js";
import mongoose from "mongoose";

// ======= Get all events (public) =======
// /api/events?page=1&limit=10&search=music&category=concert&sort=date&order=desc
const getEvents = async (req, res) => {
    try {
        // Extract query parameters with defaults
        const {
            page = 1,
            limit = 10,
            search = "",
            category = "",
            location = "",
            minPrice,
            maxPrice,
            startDate,
            endDate,
            sort = "date",
            order = "desc",
        } = req.query;

        // Handle pagination parameters
        const pageNumber = Math.max(parseInt(page) || 1, 1);
        const limitNumber = Math.max(parseInt(limit) || 10, 1);
        const skip = (pageNumber - 1) * limitNumber;

        // Build filter criteria object
        const filter = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        if (category) {
            filter.category = category;
        }

        if (location) {
            filter.location = { $regex: location, $options: "i" };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined && minPrice !== "") {
                filter.price.$gte = Number(minPrice);
            }
            if (maxPrice !== undefined && maxPrice !== "") {
                filter.price.$lte = Number(maxPrice);
            }
        }

        if (startDate || endDate) {
            filter.date = {};
            if (startDate) {
                filter.date.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.date.$lte = new Date(endDate);
            }
        }

        const allowedSortFields = ["date", "price", "title", "createdAt"];
        const sortField = allowedSortFields.includes(sort) ? sort : "date";
        const sortOrder = order === "asc" ? 1 : -1;

        // Get events and total count in parallel
        const [events, totalEvents] = await Promise.all([
            Event.find(filter)
                .populate("createdBy", "name")
                .sort({ [sortField]: sortOrder })
                .skip(skip)
                .limit(limitNumber),
            Event.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(totalEvents / limitNumber);

        // Send response with events and pagination info
        res.status(200).json({
            success: true,
            message: "Events retrieved successfully",
            data: {
                events,
                pagination: {
                    currentPage: pageNumber,
                    totalPages,
                    totalEvents,
                    limit: limitNumber,
                },
            },
        });
    } catch (error) {
        error.status = 500;
        error.message = "Server error while retrieving events";
        throw error;
    }
};

// ======= Get single event (public) =======
const getEvent = async (req, res) => {
    try {
        // extract id from route params
        const { id } = req.params;

        // ensure id exists and valid
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "Event ID is required" });
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid Event ID" });
        }

        // search for event by id
        const existingEvent = await Event.findById(id).populate(
            "createdBy",
            "_id name",
        );

        // ensure it exists
        if (!existingEvent) {
            return res
                .status(404)
                .json({ success: false, message: "Event not found" });
        }

        // send reposnse with event data
        res.status(200).json({
            success: true,
            message: "Event retrieved successfully",
            data: existingEvent,
        });
    } catch (error) {
        error.status = 500;
        error.message = "Server error while retrieving event";
        throw error;
    }
};

// ======= Create new event (admin only) =======
const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            date,
            location,
            category,
            capacity,
            price,
        } = req.body;
        const creatorId = req.user?._id || req.user?.id || req.body.createdBy; // based on how auth middleware sets user info

        if (!creatorId || !mongoose.Types.ObjectId.isValid(creatorId)) {
            return res.status(400).json({
                success: false,
                message: "The event creator not found",
            });
        }

        // create new event instance + save it in db
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            category,
            capacity: Number(capacity),
            price: Number(price),
            createdBy: creatorId,
        });
        await newEvent.save();

        // send response with the created event data
        res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: newEvent,
        });
    } catch (error) {
        error.status = 500;
        error.message = "Server error while creating event";
        throw error;
    }
};

// ======= Update event (admin only) =======
const updateEvent = async (req, res) => {
    try {
        // extract id from url params
        const { id } = req.params;

        // ensure id exists and valid
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "Event ID is required" });
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid Event ID" });
        }

        // search for event by id
        const existingEvent = await Event.findById(id);

        // ensure event exists
        if (!existingEvent) {
            return res
                .status(404)
                .json({ success: false, message: "Event not found" });
        }

        // update event fields + save
        const updatableFields = [
            "title",
            "description",
            "date",
            "location",
            "category",
            "capacity",
            "price",
        ];
        updatableFields.forEach((field) => {
            if (req.body.hasOwnProperty(field)) {
                existingEvent[field] = req.body[field];
            }
        });
        await existingEvent.save();

        // send reposnse with the updated event data
        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            data: existingEvent,
        });
    } catch (error) {
        error.status = 500;
        error.message = "Server error while updating event";
        throw error;
    }
};

// ======= Delete event (admin only) =======
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        // ensure id exists and valid
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: "Event ID is required" });
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid Event ID" });
        }

        // delete event
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res
                .status(404)
                .json({ success: false, message: "Event not found" });
        }

        // send response confirming deletion
        res.status(200).json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (error) {
        error.status = 500;
        error.message = "Server error while deleting event";
        throw error;
    }
};

export { getEvents, getEvent, createEvent, updateEvent, deleteEvent };
