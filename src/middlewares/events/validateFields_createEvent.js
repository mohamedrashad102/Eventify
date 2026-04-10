import mongoose from "mongoose";

const validateFields_createEvent = (req, res, next) => {
    const data = req.body;

    // Validate title
    if (!data.title) {
        return res
            .status(400)
            .json({ success: false, message: "Title is required" });
    }
    if (
        typeof data.title !== "string" ||
        data.title.trim().length < 3 ||
        data.title.length > 100
    ) {
        return res.status(400).json({
            success: false,
            message: "Title must be between 3 and 100 characters",
        });
    }

    // Validate description
    if (!data.description) {
        return res
            .status(400)
            .json({ success: false, message: "Description is required" });
    }
    if (
        typeof data.description !== "string" ||
        data.description.trim().length < 10 ||
        data.description.length > 1000
    ) {
        return res.status(400).json({
            success: false,
            message: "Description must be between 10 and 1000 characters",
        });
    }

    // Validate date
    if (!data.date) {
        return res
            .status(400)
            .json({ success: false, message: "Date is required" });
    }
    const eventDate = new Date(data.date);
    if (isNaN(eventDate.getTime())) {
        return res
            .status(400)
            .json({ success: false, message: "Date must be a valid date" });
    }
    if (eventDate <= new Date()) {
        return res.status(400).json({
            success: false,
            message: "Date must be in the future",
        });
    }

    // Validate location
    if (!data.location) {
        return res
            .status(400)
            .json({ success: false, message: "Location is required" });
    }
    if (
        typeof data.location !== "string" ||
        data.location.trim().length < 3 ||
        data.location.length > 200
    ) {
        return res.status(400).json({
            success: false,
            message: "Location must be between 3 and 200 characters",
        });
    }

    // Validate category
    if (!data.category) {
        return res
            .status(400)
            .json({ success: false, message: "Category is required" });
    }
    const validCategories = [
        "concert",
        "conference",
        "workshop",
        "seminar",
        "sports",
        "other",
    ];
    if (!validCategories.includes(data.category)) {
        return res.status(400).json({
            success: false,
            message:
                "Category must be one of: concert, conference, workshop, seminar, sports, other",
        });
    }

    // Validate capacity
    if (data.capacity === undefined || data.capacity === null) {
        return res
            .status(400)
            .json({ success: false, message: "Capacity is required" });
    }
    const capacityNum = Number(data.capacity);
    if (!Number.isInteger(capacityNum) || capacityNum <= 0) {
        return res.status(400).json({
            success: false,
            message: "Capacity must be a positive integer",
        });
    }

    // Validate price
    if (data.price === undefined || data.price === null) {
        return res
            .status(400)
            .json({ success: false, message: "Price is required" });
    }
    const priceNum = Number(data.price);
    if (isNaN(priceNum) || priceNum < 0) {
        return res.status(400).json({
            success: false,
            message: "Price must be a non-negative number",
        });
    }

    // Ensure createdBy exists and is a valid ObjectId
    const creatorId = req.user?._id || req.user?.id || req.body.createdBy;       // based on how auth middleware sets user info
    if (!creatorId) {
        return res
            .status(400)
            .json({ success: false, message: "The event creator is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(creatorId)) {
        return res
            .status(400)
            .json({ success: false, message: "The event creator is not a valid ObjectId" });
    }

    next();
};

export default validateFields_createEvent;
