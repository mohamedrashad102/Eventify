import Event from "../models/Event.js";
import mongoose from "mongoose";

// ======= Get all events (public) =======
// /api/events?page=1&limit=10&search=music&category=concert&sort=date&order=desc
const getEvents = async (req, res) => {
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
    res.json({
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
};



// ======= Get single event (public) =======
const getEvent = async (req, res) => {
    // extarct id from route params
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
    res.json({
        success: true,
        message: "Event retrieved successfully",
        data: existingEvent,
    });
};



// ======= Create new event (admin only) =======
const createEvent = (req, res) => {

};

// ======= Update event (admin only) =======
const updateEvent = (req, res) => {};

// ======= Delete event (admin only) =======
const deleteEvent = (req, res) => {};

export { getEvents, getEvent, createEvent, updateEvent, deleteEvent };
