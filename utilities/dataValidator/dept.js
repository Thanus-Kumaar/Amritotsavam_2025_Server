import { validateBasicString } from "./common.js";
import validator from "validator";

// Validate dept data
const validateDeptData = (data) => {
    if (!validateBasicString(data.deptName, 255))
        return "Invalid or missing dept name.";
    if (
        !validateBasicString(data.imageUrl, 255) ||
        !validator.isURL(data.imageUrl)
    )
        return "Invalid or missing image URL.";
    if (!validateBasicString(data.deptHead, 255))
        return "Invalid or missing dept head.";
    if (!validateBasicString(data.deptAbbrevation, 50))
        return "Invalid or missing dept abbreviation."; // Assuming abbreviation max length is 50
    if (!validateBasicString(data.godName, 255))
        return "Invalid or missing god name.";
    return null; // No validation errors
};

// Validate dept ID
const validateDeptID = (deptID) => {
    if (!validator.isInt(String(deptID), { min: 1 })) return "Invalid dept ID."; // Ensures it's a positive integer
    return null;
};

export { validateDeptData, validateDeptID };
