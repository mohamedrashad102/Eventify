const validateFields_updateEvent = (req, res, next) => {
    const data = req.body;

    const updatableFields = [
        "title",
        "description",
        "date",
        "location",
        "category",
        "capacity",
        "price",
    ];

    const hasAtLeastOneField = updatableFields.some((field) =>
        data.hasOwnProperty(field),
    );

    if (!hasAtLeastOneField) {
        return res.status(400).json({
            success: false,
            message:
                "At least one field is required: title, description, date, location, category, capacity, or price",
        });
    }

    // Validate title
    if (
        data.hasOwnProperty("title") &&
        (typeof data.title !== "string" ||
            data.title.trim().length < 3 ||
            data.title.length > 100)
    ) {
        return res.status(400).json({
            success: false,
            message: "Title must be between 3 and 100 characters",
        });
    }

    // Validate description
    if (
        data.hasOwnProperty("description") &&
        (typeof data.description !== "string" ||
            data.description.trim().length < 10 ||
            data.description.length > 1000)
    ) {
        return res.status(400).json({
            success: false,
            message: "Description must be between 10 and 1000 characters",
        });
    }

    // Validate date
    if (data.hasOwnProperty("date")) {
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
    }

    // Validate location
    if (
        data.hasOwnProperty("location") &&
        (typeof data.location !== "string" ||
            data.location.trim().length < 3 ||
            data.location.length > 200)
    ) {
        return res.status(400).json({
            success: false,
            message: "Location must be between 3 and 200 characters",
        });
    }

    // Validate category
    const validCategories = [
        "concert",
        "conference",
        "workshop",
        "seminar",
        "sports",
        "other",
    ];
    if (
        data.hasOwnProperty("category") &&
        !validCategories.includes(data.category)
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Category must be one of: concert, conference, workshop, seminar, sports, other",
        });
    }

    // Validate capacity
    if (data.hasOwnProperty("capacity")) {
        const capacityNum = Number(data.capacity);
        if (!Number.isInteger(capacityNum) || capacityNum <= 0) {
            return res.status(400).json({
                success: false,
                message: "Capacity must be a positive integer",
            });
        }
    }

    // Validate price
    if (data.hasOwnProperty("price")) {
        const priceNum = Number(data.price);
        if (isNaN(priceNum) || priceNum < 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be a non-negative number",
            });
        }
    }

    next();
};

export default validateFields_updateEvent;
