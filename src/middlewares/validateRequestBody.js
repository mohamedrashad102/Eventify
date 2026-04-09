const validateRequestBody = (req, res, next) => {
    const data = req.body;
    // ensure body exists and not empty
    if (!data || Object.keys(data).length === 0) {
        return res
            .status(400)
            .json({ success: false, message: "Request body is required" });
    }

    // check data format
    if (typeof data !== "object") {
        return res.status(400).json({
            success: false,
            message: "Request body must be a valid JSON object",
        });
    }

    next();
};

export default validateRequestBody;
